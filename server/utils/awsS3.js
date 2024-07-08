require("dotenv").config();
const fs = require("fs");
// const { CloudFrontClient, CreateInvalidationCommand } = require("@aws-sdk/client-cloudfront");
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_ACCESS_SECRET_KEY
  }
});
const bucketName = process.env.AWS_S3_BUCKET_NAME;
const cdnURL = process.env.AWS_S3_CDN_URL;
// const cdnRegion = process.env.AWS_S3_CDN_REGION;
// const cdnId = process.env.AWS_S3_CDN_ID;
// const cdnClient = new CloudFrontClient({ region: cdnRegion });

function getImageCDN(key) {
  return cdnURL + key;
}
async function getImageS3(key, filename) {
  try {
    const params = {
      Bucket: bucketName,
      Key: key
    };
    let command = new GetObjectCommand(params);
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (err) {
    console.error("Error getting image:", err);
    throw err;
  }
}
async function putImageS3(filePath, type, fileName) {
  const mimetype = (type =="image") ? "image/jpg" : "video/mp4";
  const fileStream = fs.createReadStream(filePath);
  const params = {
    Bucket: bucketName,
    Key: fileName, //s3 wil replace the same name object!
    Body: fileStream,
    ContentType: mimetype
  };

  const data = await s3Client.send(new PutObjectCommand(params));
  return data;
}
async function putStreamImageS3(fileStream, filename, filetype) {
  try {
    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: fileStream,
      ContentType: filetype //image/jpeg, video/mp4
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

module.exports = {
  getImageCDN,
  getImageS3,
  putImageS3,
  putStreamImageS3
};
