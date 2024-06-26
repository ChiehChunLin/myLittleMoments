const moment = require("moment");
const conn = require("../database/connDB");
const userDB = require("../database/userDB");
const babyDB = require("../database/babyDB");
const imageDB = require("../database/imageDB");
const textDB = require("../database/textDB");
const awsS3 = require("../utils/awsS3");
const babyConst = require("../utils/getBabyConst");
const babyFakeData = require("../utils/babyDailyData");
const time = require("../utils/getFormattedDate");
const { getImageCDN, createInvalidation } = require("../utils/awsS3");

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
      data.headshot = getImageCDN(data.headshot);
      data.cover = getImageCDN(data.cover);
    })
    const babyData = follows[0];
    babyData.followsCount = follows.length;

    const startDate = time.getDateBefore30days();
    const imageData = await imageDB.getImageByMonth(
      conn,
      babyData.id,
      startDate
    );
    imageData.map((dateData) => {
      dateData.images.map((image) => {
        image.filename = getImageCDN(`${babyData.id}/${image.filename}`);
      });
    });
    const textData = await textDB.getTextByMonth(conn, babyData.id, startDate);
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
const healthController = async (req, res, next) => {
  try {
    const { babyId, date } = req.body;

    // healthData
    const weightData = await babyDB.getBabyWeightData(conn, babyId);
    const heightData = await babyDB.getBabyHeightData(conn, babyId);
    const dailys = await babyDB.getBabyDailyWeek(conn, babyId, date);
    
    dailys.map((date) => {
      date.daily.map((activity) => {
        if (activity.activity == babyConst.babyActivity.SLEEP) {
          const hours = activity.quantity;
          date.daily.endtime = moment(activity.starttime).add(
            moment.duration(hours, "hours")
          );
          date.daily.unit = babyConst.babyActivityUnit[activity.activity];
        } else {
          date.daily.endtime = moment(activity.starttime).add(
            moment.duration(1, "hours")
          );
          date.daily.unit = babyConst.babyActivityUnit[activity.activity];
        }
      });
    });
    const dailyData = babyFakeData;

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
    babyData.headshot = getImageCDN(babyData.headshot);
    babyData.cover = getImageCDN(babyData.cover);

    // imageData
    const startDate = time.getDateBefore30days();
    const imageData = await imageDB.getImageByMonth(
      conn,
      babyId,
      startDate
    );
    imageData.map((dateData) => {
      dateData.images.map((image) => {
        image.filename = getImageCDN(`${babyData.id}/${image.filename}`);
      });
    });

    // textData
    const textData = await textDB.getTextByMonth(conn, babyId, startDate);

    // healthData
    const weightData = await babyDB.getBabyWeightData(conn, babyId);
    const heightData = await babyDB.getBabyHeightData(conn, babyId);
    const dailys = await babyDB.getBabyDailyWeek(conn, babyId, date);
    
    dailys.map((date) => {
      date.daily.map((activity) => {
        if (activity.activity == babyConst.babyActivity.SLEEP) {
          const hours = activity.quantity;
          date.daily.endtime = moment(activity.starttime).add(
            moment.duration(hours, "hours")
          );
          date.daily.unit = babyConst.babyActivityUnit[activity.activity];
        } else {
          date.daily.endtime = moment(activity.starttime).add(
            moment.duration(1, "hours")
          );
          date.daily.unit = babyConst.babyActivityUnit[activity.activity];
        }
      });
    });
    const dailyData = babyFakeData;
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
      image.filename = getImageCDN(`${babyId}/${image.filename}`);
    })
    res.status(200).send({ images });
  } catch (error) {
    next(error);
  } 
}

const uploadImageToS3 = async (req, res, next) => {
  try {
    const { babyId, type } = req.body;

    const file = req.files.file[0];
    if (file != undefined) {
      const filename = (type === "profile") ? `${babyId}/babyProfile`: `${babyId}/babyCover`;

      // await awsS3.createInvalidation([filename]);
      const awsResult = await awsS3.putStreamImageS3( file.buffer, filename, file.mimetype);
      if (awsResult.$metadata.httpStatusCode !== 200) {
        console.log("S3 result: %j", awsResult);
        throw new Error("image upload to S3 failed!");
      }
      await awsS3.createInvalidation([filename]);
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

module.exports = {
  firstFollowRender,
  firstFollowController,
  healthController,
  babyTimelineTabsData,
  dailyImages,
  timelineRender,
  uploadImageToS3
};
