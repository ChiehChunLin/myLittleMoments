const conn = require("../database/connDB");
const userDB = require("../database/userDB");
const babyDB = require("../database/babyDB");
const imageDB = require("../database/imageDB");
const { getDateDifference } = require("../utils/getFormattedDate");
const { getImageCDN } = require("../utils/getCdnFile");
const dailyData = require("../utils/babyDailyData");

const userId = 657590400000;
const userEmail = "justme11012@gmail.com";
const babyId = 1682294400000;

const testS3Controller = async (req, res, next) => {
  try {
    const imgUrl =
      "https://d2baetmhv58dd6.cloudfront.net/1682294400000/2024-06-16/512921638023987330";
    res.status(200).render("imageDisplay", { imgUrl });
  } catch (error) {
    next(error);
  }
};

const testTimelineController = async (req, res, next) => {
  try {
    //after login, redirect to "/timeline" and display
    const userData = await userDB.getUserInfo(conn, userId);

    const follows = userData.follows == null ? [] : userData.follows;
    follows.map((babyData) => {
      babyData.headshot = getImageCDN(babyData.headshot);
    });

    const babyData = await babyDB.getBaby(conn, babyId);
    babyData.old = getDateDifference(babyData.birthday);
    babyData.headshot = getImageCDN(babyData.headshot);
    babyData.cover = getImageCDN(babyData.cover);
    babyData.followsCount = follows.length;

    const imageData = await imageDB.getImageByMonth(conn, babyId, "2024-06-01");
    imageData.map((dateData) => {
      dateData.images.map((image) => {
        image.filename = getImageCDN(`${babyId}/${image.filename}`);
      });
    });

    // res.status(200).send({ data });
    res.status(200).render("timeline", {
      follows,
      babyData,
      imageData,
      textData: [],
      tagData: []
    });
  } catch (error) {
    next(error);
  }
};

const testDailyPlot = async (req, res, next) => {
  res.status(200).render("firstFollow");
};

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
module.exports = { lineUserList, newBaby, testS3Controller, testTimelineController, testDailyPlot };
