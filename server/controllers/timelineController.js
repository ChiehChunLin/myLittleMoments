const conn = require("../database/connDB");
const userDB = require("../database/userDB");
const babyDB = require("../database/babyDB");
const imageDB = require("../database/imageDB");
const { getDateDifference } = require("../utils/getFormattedDate");
const { getImageCDN } = require("../utils/getCdnFile");

const timelineController = async (req, res, next) => {
  try {
    const { user } = req;
    //after login, redirect to "/timeline" and display
    const userId = 657590400000;
    const userEmail = "justme11012@gmail.com";

    const userData = await userDB.getUserByEmail(conn, userEmail);
    const follows = userData.follows;
    follows.map((babyData) => {
      babyData.headshot = getImageCDN(babyData.headshot);
    });
    const babyId = follows[0].id;

    const babyData = await babyDB.getBaby(conn, babyId);
    babyData.old = getDateDifference(babyData.birthday);
    babyData.headshot = getImageCDN(babyData.headshot);
    babyData.cover = getImageCDN(babyData.cover);
    babyData.followsCount = follows.length;

    const { data } = await imageDB.getImageByMonth(conn, babyId, "2024-06-01");
    data.map((dateData) => {
      const urls = dateData.images.map((url) => {
        return getImageCDN(`${babyId}/${url}`);
      });
      dateData.images = urls;
    });
    // res.status(200).send({ babyData });
    res.status(200).render("timeline", { follows, babyData, data });
  } catch (error) {
    next(error);
  }
};
module.exports = { timelineController };
