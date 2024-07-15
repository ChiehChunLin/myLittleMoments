const dotenv = require("dotenv").config();
const Redis = require('ioredis');
const mysql = require("mysql2");
const fs = require("fs");
const { spawn } = require('child_process');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const configDB = [
  {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE //myBaby
  },
  {
    host: process.env.AWS_RDS_HOST,
    user: process.env.AWS_RDS_USERNAME,
    password: process.env.AWS_RDS_PASSWORD,
    database: process.env.AWS_RDS_DATABASE //myBaby
  }
];
const conn = mysql.createPool(configDB[process.env.MYSQL_DATABASE_CONNDB_INDEX]).promise();
const redis = new Redis({
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    if (times % 4 ==0) { 
      console.error('Redis error: reconnect exhausted after 3 retries.');
      return null;
    }
    return 200;
  }
});
const s3Client = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_ACCESS_SECRET_KEY
  }
});
const faceCase ={
  FACE_TRAIN: 1,
  FACE_VALID: 2
}
async function testFunction(data){
  console.log('Received message:', data);
  await new Promise(resolve => setTimeout(resolve, 2000)); // wait for 3 seconds
  console.log('Processed message:', data);
}
function faceTrain(imageFiles){

  return new Promise((resolve, reject) => {
    faceControl(faceCase.FACE_TRAIN, imageFiles, (err, resultStr) => {
      if (err) {
        console.log(`newBabyTrain Fail: ${err}`);
      }
      if(resultStr === null){
        console.log(`newBabyTrain result null`);
        return;
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
      console.log(`newBabyTrain Complete: ${resultArrays}`);
      return resolve(imageFiles);
    })
  })  
}
function faceRecognition(imageFiles, queueMsg) {
  // queueMsg: {
  //   userId: '1718868972609',
  //   managerBabyList: [ { babyId: 1682294400000 }, { babyId: 1719291894152 } ],
  //   key: '2024-07-12/1231321321321',
  // }
  return new Promise((resolve, reject) => {
    const { userId, managerBabyList, key  } = queueMsg;
    let babyIds = [];

    faceControl(faceCase.FACE_VALID, imageFiles, (err, resultStr) => {
      if (err) {
        console.error(err.message);
        return reject(`Process error: ${err.message}`);
      }        
      const resultArrays = resultStr.split(/\s+/);
      console.log(resultArrays);
      // [ 
      //    '1719820286587-2',
      //    '0.74',
      //    'unknown',
      //    '0.38',
      //    '' 
      //  ]
      managerBabyList.forEach(baby => {
        babyIds.push(baby.babyId.toString());
      });  
      resultArrays.map( result => {
        if(result.includes("-")){
          const id = result.split('-')[0];
          if(!babyIds.includes(id)){
            babyIds.push(id);
          }
        }
      })
      console.log(babyIds);
      babyIds.map(async babyId => {
        console.log(`detect face id: ${babyId}`);
        await uploadTimelineImageToS3(imageFiles[0], "image", userId, babyId, key);
      });      
      return resolve(imageFiles);
    })
  })  
}
function faceControl(caseCode, imagePaths, callback) {
  const scriptPath = "../faceHandler/faceHandler.py";
  function constructPython(caseCode, imagePaths){
      return [scriptPath, caseCode, imagePaths];
  }
  const constructs = constructPython(caseCode, imagePaths);
  const pythonProcess = spawn(process.env.PYTHON3_PATH, constructs);
  // const pythonProcess = spawn('python3', constructs);

  let resultStr = '';
  let error = '';

  pythonProcess.stdout.on('data', (data) => {
      // console.log("stdout")
      // console.log(data.toString())
      resultStr += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
      // console.log("stderr")
      // console.log(data.toString())
      error += data.toString();
  });

  pythonProcess.on('close', (code) => {
      console.log("close")
      if (code !== 0) {
          callback(new Error(`Python script exited with code ${code}\n${error}`), null);
      } else {
          callback(null, resultStr);
      }
  });
}
async function putStreamImageS3(filePath, type, fileName) {
  try {
    const mimetype = (type =="image") ? "image/jpg" : "video/mp4";
    const fileStream = fs.createReadStream(filePath);
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: fileStream,
      ContentType: mimetype //image/jpeg, video/mp4
    };
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: params
    });

    parallelUploads3.on("httpUploadProgress", (progress) => {
      // console.log(progress);
    });

    const data = await parallelUploads3.done();
    return data;
  } catch (e) {
    console.log(e);
  }
}
async function setImage( conn, userId, babyId, type, filename, date = "" ) {
  const imageDate = date == "" ? new Date().toLocaleString('af-ZA', { hour12: false }) : date;
  const [rows] = await conn.query(
    `
     INSERT INTO images (userId, babyId, type, filename, timestamp)
     VALUES (?,?,?,?,?)
    `,
    [userId, babyId, type, filename, imageDate]
  );
  // console.log("setImage:" + JSON.stringify(rows));
  return rows.insertId;
}
async function uploadTimelineImageToS3 (filePath, type, userId, babyId, key){
  const awsResult = await putStreamImageS3(filePath, type, `${babyId}/${key}`);
  if (awsResult.$metadata.httpStatusCode !== 200) {
    console.log("S3 result: %j", awsResult);
    throw new Error("image upload to S3 failed!");
  }
  const insertId = await setImage(conn, userId, babyId, type, key);
  if( insertId == undefined){
    console.log("setImage insertId: %j", insertId);
    throw new Error("image info to DB failed!");
  }
}
async function worker() {
  console.log("queue started");
  while (true) {
      try {
          const message = await redis.blpop(process.env.REDIS_LIST, 10); // 0 means the command will block indefinitely
          const [key, dataStr] = message;
          const data = JSON.parse(dataStr);
          console.log("data: %j", data);
          if (data) { 
            // await testFunction(data);
            const { prcoessCase, imageFiles, queueMsg } = data;
            let uploadFiles = [];
            switch(prcoessCase){
              case faceCase.FACE_TRAIN:
                uploadFiles = await faceTrain(imageFiles);
                break;
              case faceCase.FACE_VALID:
                uploadFiles = await faceRecognition(imageFiles, queueMsg);
                break;
            }            
            uploadFiles.forEach(path =>{
              fs.unlink(path, (err) => {
                if (err) {
                    console.error('File deletion failed:', err);
                } else {
                    console.log(`${path} deleted successfully`);
                }
              });
            });                
          }
      } catch (err) {
        console.log(typeof err.message)
        if(err.message.includes("message is not iterable")) {
          //nothing in queue, wait for next message
          continue;
        }
        console.error('Error while processing message:', err);
      }
  }
}

worker();