const fs = require("fs");
const util = require("util");
const sharp = require("sharp");
const moment = require("moment");
const faceControl = require("./pythonController")
const conn = require("../database/connDB");
const userDB = require("../database/userDB");
const babyDB = require("../database/babyDB");
const imageDB = require("../database/imageDB");
const textDB = require("../database/textDB");
const awsS3 = require("../utils/awsS3");
const babyConst = require("../utils/getBabyConst");
const babyFakeData = require("../utils/babyDailyData");
const time = require("../utils/getFormattedDate");
const { getSerialTimeFormat } = require("../utils/getFormattedDate");
const { pipeline } = require("stream");

const faceCase ={
  FACE_TRAIN: 1,
  FACE_VALID: 2
}

const timelineRender = async (req, res, next) => {
  try {
    const { user } = req;
    const userData = await userDB.getUserInfo(conn, user.id);
    if (userData.follows == null) {
      return res.status(200).render("timeline", {
        follows: [],
        babyData: [],
        imageData: [],
        textData: [],
        tagData: [],
        newFollow: "divShow"
      });
    }

    //userDB grep user data then get babyInfo from babyList[0]
    const follows = userData.follows;
    follows.map(data => {
      data.old = time.getDateDifference(data.birthday);
      data.headshot = awsS3.getImageCDN(data.headshot);
      data.cover = awsS3.getImageCDN(data.cover);
    })
    const babyData = follows[0];
    babyData.followsCount = follows.length;

    const today = moment().format('YYYY-MM-DD');
    const imageData = await imageDB.getImageByMonth(
      conn,
      babyData.id,
      today
    );
    imageData.map((dateData) => {
      dateData.images.map((image) => {
        image.filename = awsS3.getImageCDN(`${babyData.id}/${image.filename}`);
      });
    });
    const textData = await textDB.getTextByMonth(conn, babyData.id, today);
    // console.log(textData);
    // res.status(200).send({ data });
    res.status(200).render("timeline", {
      follows,
      babyData,
      imageData,
      textData,
      tagData: [],
      newFollow: "divHide"
    });
  } catch (error) {
    next(error);
  }
};
const firstFollowRender = async (req, res, next) => {
  try {
    res.status(200).render("firstFollow");
  } catch (error) {
    next(error);
  }
};
const firstFollowController = async (req, res, next) => {
  try {
    const { user } = req;

    if (user) {
      const { babyId, babyRole, relation } = req.body;
      const followBaby = await userDB.setUserFollowBaby(
        conn,
        user.id,
        babyId,
        babyRole,
        relation
      );

      if (followBaby) {
        return res.status(200).send({ message: "Follow Successfully!" });
      }
    }
    return res.status(500).send({ message: "user is not defined" });
  } catch (error) {
    next(error);
  }
};
const newBabyController = async (req, res, next) => {
  try {
    const { user } = req;
    if(!user){
      return res.status(500).send({ message: "user is not defined" });
    }
    const { babyRole, babyCall, babyName, babyGender, babyBirth, babyId } = req.body;   
    const trainFiles = [];
    if(req.files.babyFront){
      trainFiles.push(req.files.babyFront[0]);
    }
    if(req.files.babySide){
      trainFiles.push(req.files.babySide[0]);
    }
    if(req.files.babyUpward){
      trainFiles.push(req.files.babyUpward[0]);
    }
    // {
    //   fieldname: 'babyFront',
    //   originalname: '1682294400000-1.jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 48 00 48 00 00 ff e1 00 58 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 02 01 12 00 03 00 00 00 01 00 01 ... 219324 more bytes>,
    //   size: 219374
    // }
    const newBabyId = await babyDB.newBaby(conn, babyName, babyGender, babyBirth, babyId);
    const followBaby = await userDB.setUserFollowBaby(conn, user.id, newBabyId, babyRole, babyCall);

    const trainPaths = [];
    for(let i = 0; i < trainFiles.length ; i++){
      const filename = `${newBabyId}-${i + 1}`;
      const fileExtension = trainFiles[i].mimetype.split('/')[1];
      const filePath = `faceUploads/${filename}.${fileExtension}`;
      await saveImageFromBuffer(trainFiles[i].buffer, filePath);
      trainPaths.push(filePath);
    }

    if(trainPaths.length > 0){
      //child_process
      faceControl(faceCase.FACE_TRAIN, trainPaths, (err, resultStr) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err.message);
        }
        const resultArrays = resultStr.split(/\s+/);
        // [
        //   '1719820286587-1',
        //   'Success',
        //   '1719820286587-2',
        //   'Success',
        //   '1719820286587-3',
        //   'Success',
        //   ''
        // ]
        let trainMsg =""
        if(resultArrays.includes('Success')){
          trainMsg = " Train"
        }
        if(newBabyId && followBaby && resultArrays.includes('Success')){
          return res.status(200).send({ message: `New Baby${trainMsg} and Follow Successfully!` });
        }
      })        
    }    
  } catch (error) {
    next(error);
  }
}
const recognizeBabyFaceTest = async (req, res, next) => {
  try {
    const filePath = `faceUploads/validBabyTemp.jpg`;
    const imageFiles = [ filePath ];
    faceControl(faceCase.FACE_VALID, imageFiles, (err, resultStr) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      const babyIds = [];
      const resultArrays = resultStr.split(/\s+/);
      // [ 
      //    '1719820286587-2',
      //    '0.74',
      //    'unknown',
      //    '0.38',
      //    '' 
      //  ]
      resultArrays.map(result => {
        if(result.includes("-")){
          const id = result.split('-')[0];
          if(!babyIds.includes(id)){
            babyIds.push(id);
          }
        }
      })
      return res.status(200).send(babyIds);
    })    
  } catch (error) {
    next(error);
  }
}
const recognizeBabyFace = async (req, res, next) => {
  try {
    //req from Lambda, won't have user.id (handle in userRoute)
    const babyId = req.query.id;
    const key = req.query.path;
    const filePath = `faceUploads/validBabyTemp.jpg`;
    await awsS3.dumpImageFromS3(key, filePath, (err, path) => {
        if(err){
          return res.status(500).send(err.message);
        }
        if(path){
            const imageFiles = [ path ];
            console.log(imageFiles);
            // faceControl(faceCase.FACE_VALID, imageFiles, (err, resultStr) => {
            //   if (err) {
            //     return res.status(500).send(err.message);
            //   }
            //   const babyIds = [];
            //   const resultArrays = resultStr.split(/\s+/);
            //   // [ 
            //   //    '1719820286587-2',
            //   //    '0.74',
            //   //    'unknown',
            //   //    '0.38',
            //   //    '' 
            //   //  ]
            //   resultArrays.map(result => {
            //     if(result.includes("-")){
            //       const id = result.split('-')[0];
            //       if(!babyIds.includes(id)){
            //         babyIds.push(id);
            //       }
            //     }
            //   })
            //   return res.status(200).send(babyIds);
            // })
        }
    })    
  } catch (error) {
    next(error);
  }
}

const healthController = async (req, res, next) => {
  try {
    const { babyId, date } = req.body;

    // healthData
    const weightData = await babyDB.getBabyWeightData(conn, babyId);
    const heightData = await babyDB.getBabyHeightData(conn, babyId);
    const dailyData = await getWeekDailyData(babyId);

    res.status(200).send({ weightData, heightData, dailyData});
  } catch (error) {
    next(error);
  }
}
const babyTimelineTabsData = async (req,res,next) => {
  try{
    const { babyId, date } = req.body;

    // babyData
    const babyData = await babyDB.getBaby(conn, babyId);
    babyData.old = time.getDateDifference(babyData.birthday);
    babyData.headshot = awsS3.getImageCDN(babyData.headshot);
    babyData.cover = awsS3.getImageCDN(babyData.cover);

    // imageData
    const today = moment().format('YYYY-MM-DD');
    const imageData = await imageDB.getImageByMonth(
      conn,
      babyId,
      today
    );
    imageData.map((dateData) => {
      dateData.images.map((image) => {
        image.filename = awsS3.getImageCDN(`${babyData.id}/${image.filename}`);
      });
    });

    // textData
    const textData = await textDB.getTextByMonth(conn, babyId, today);

    // healthData
    const weightData = await babyDB.getBabyWeightData(conn, babyId);
    const heightData = await babyDB.getBabyHeightData(conn, babyId);
    const dailyData = await getWeekDailyData(babyId);    
    healthData = { weightData, heightData, dailyData};

    res.status(200).send({ babyData, imageData, textData, healthData });
  } catch (error) {
    next(error);
  } 
}
const dailyImages = async (req,res,next) => {
  try{
    const { babyId, date } = req.body;
    const images = await imageDB.getImageByDate(conn, babyId, date);
    images.map(image =>{
      image.filename = awsS3.getImageCDN(`${babyId}/${image.filename}`);
    })
    res.status(200).send({ images });
  } catch (error) {
    next(error);
  } 
}

const uploadImageToS3 = async (req, res, next) => {
  try {
    const { babyId, type } = req.body;

    const timestap = getSerialTimeFormat();
    const file = req.files.file[0];
    if (file != undefined) {
      const filename = (type === "profile") ? `headshots/${timestap}-${babyId}`: `covers/${timestap}-${babyId}`;

      const awsResult = await awsS3.putStreamImageS3( file.buffer, filename, file.mimetype);
      if (awsResult.$metadata.httpStatusCode !== 200) {
        console.log("S3 result: %j", awsResult);
        throw new Error("image upload to S3 failed!");
      }
      if(type ==="profile"){
        await babyDB.updateBabyHeadshot(conn, babyId, filename);
      }
      if(type ==="cover"){
        await babyDB.updateBabyCover(conn, babyId, filename);
      }      
    }
    res.status(200).send({message: `${type} picture update successfully!`});
  } catch (error) {
    next(error);
  }
};

async function getWeekDailyData(babyId){
  const dailyData =[];
  for (let i=0; i< 7 ; i++) {
    const currentDate = moment().subtract(i, 'd').format('YYYY-MM-DD');
    const dailys = await babyDB.getBabyDailyDay(conn, babyId, currentDate);
    if(dailys.length > 0){
      const currentDaily = dailys[0];
      currentDaily.daily.map(item => {
        if(item.activity == babyConst.babyActivity.SLEEP){
          item.starttime = moment(item.endtime).subtract(item.quantity, 'h');          
        } else{
          item.starttime = moment(item.endtime).subtract(1, 'h');
        }
        item.unit = babyConst.babyActivityUnit[item.activity];        
      })
      dailyData.push(currentDaily);
    } else {
      const initDaily = {
        date: currentDate,
        dailyMilk: 0,
        dailyFood: 0,
        dailySleep: 0,
        dailyMedicine: 0,
        daily: []
      }
      dailyData.push(initDaily);
    }
  }
  return dailyData;
}
async function saveImageFromBuffer(imageBuffer, filepath) {
  
  await sharp(imageBuffer)
      .toFile(filepath)
      .then(() => {
          console.log(`Image saved as ${filepath}`);
      })
      .catch(err => {
          console.error('Error saving image:', err);
          throw err;
      });      
}
async function downloadContent(stream, downloadPath) {

  const pipelineAsync = util.promisify(pipeline);

  const writable = fs.createWriteStream(downloadPath);
  await pipelineAsync(stream, writable);
}

module.exports = {
  firstFollowRender,
  firstFollowController,
  newBabyController,
  recognizeBabyFaceTest,
  recognizeBabyFace,
  healthController,
  babyTimelineTabsData,
  dailyImages,
  timelineRender,
  uploadImageToS3
};
