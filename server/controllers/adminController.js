const conn = require("../database/connDB");
const userDB = require("../database/userDB");
const babyDB = require("../database/babyDB");
const imageDB = require("../database/imageDB");
const { getDateDifference } = require("../utils/getFormattedDate");
const { getImageCDN } = require("../utils/awsS3");
const dailyData = require("../utils/babyDailyData");

const lineUserList = async (req,res,next)=>{
  try {
    const lineUserList = await userDB.getLineUserList(conn);
    res.status(200).send({ lineUserList });
  } catch (error) {
    next(error);
  }
}
const newBaby = async (req,res,next)=>{
  try {
    const { name , gender, birthday } = req.body;
    const newBabyId = await babyDB.newBaby(conn, name , gender, birthday);
    res.status(200).send({ newBabyId });
  } catch (error) {
    next(error);
  }
}
module.exports = { lineUserList, newBaby };
