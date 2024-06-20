const moment = require("moment");
const conn = require("../database/connDB");
const userDB = require("../database/userDB");
const babyDB = require("../database/babyDB");
const imageDB = require("../database/imageDB");
const { getDateDifference } = require("../utils/getFormattedDate");
const { getImageCDN } = require("../utils/getCdnFile");
const babyConst = require("../utils/getBabyConst");
const babyFakeData = require("../utils/babyDailyData");

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
const imageController = async (req, res, next) => {
  const { babyId, date } = req.body;
};
const textController = async (req, res, next) => {
  const { babyId, date } = req.body;
};
const tagController = async (req, res, next) => {
  const { babyId } = req.body;
};
const healthController = async (req, res, next) => {
  const { babyId, date } = req.body;
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
  res.status(200).send({ dailyData, weightData, heightData });
};
module.exports = {
  timelineController,
  healthController,
  imageController,
  textController,
  tagController
};
