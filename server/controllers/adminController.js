const conn = require("../database/connDB");
const userDB = require("../database/userDB");
const babyDB = require("../database/babyDB");
const imageDB = require("../database/imageDB");
const { getDateDifference } = require("../utils/getFormattedDate");
const { getImageCDN } = require("../utils/getCdnFile");

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
    const userId = 657590400000;
    const userEmail = "justme11012@gmail.com";
    const babyId = 1682294400000;

    const userData = await userDB.getUserByEmail(conn, userEmail);
    const follows = userData.follows;
    follows.map((babyData) => {
      babyData.headshot = getImageCDN(babyData.headshot);
    });

    const babyData = await babyDB.getBaby(conn, babyId);
    babyData.old = getDateDifference(babyData.birthday);
    babyData.headshot = getImageCDN(babyData.headshot);
    babyData.cover = getImageCDN(babyData.cover);
    babyData.followsCount = follows.length;

    const data = await imageDB.getImageByMonth(conn, babyId, "2024-06-01");
    data.map((dateData) => {
      const urls = dateData.images.map((image) => {
        return getImageCDN(`${babyId}/${image}`);
      });
      dateData.images = urls;
    });
    // res.status(200).send({ data });
    res.status(200).render("timeline", { follows, babyData, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { testS3Controller, testTimelineController };
