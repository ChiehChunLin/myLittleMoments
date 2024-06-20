const moment = require("moment");
const conn = require("../database/connDB");
const userDB = require("../database/userDB");
const babyDB = require("../database/babyDB");
const imageDB = require("../database/imageDB");
const textDB = require("../database/textDB");
const babyConst = require("../utils/getBabyConst");
const babyFakeData = require("../utils/babyDailyData");
const time = require("../utils/getFormattedDate");
const { getImageCDN } = require("../utils/getCdnFile");

const timelineRender = async (req, res, next) => {
  try {
    const { user } = req;

    const userData = await userDB.getUserInfo(conn, user.id);
    if (userData.follows == null) {
      return res.status(200).redirect("/timeline/firstFollow");
    }

    const follows = userData.follows;
    const babyData = follows[0];
    babyData.old = time.getDateDifference(babyData.birthday);
    babyData.headshot = getImageCDN(babyData.headshot);
    babyData.cover = getImageCDN(babyData.cover);
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
    console.log(textData);
    // res.status(200).send({ data });
    res.status(200).render("timeline", {
      follows,
      babyData,
      imageData,
      textData,
      tagData: []
    });
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
      console.log("firstFollowController");
      const { babyId, babyRole, relation } = req.body;
      const followId = await userDB.setUserFollowBaby(
        conn,
        user.id,
        babyId,
        babyRole,
        relation
      );
      if (followId) {
        return res.status(200).send({ message: "Follow Successfully!" });
      }
    }
    return res.status(500).send({ message: "user is not defined" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  firstFollowRender,
  firstFollowController,
  timelineRender,
  healthController,
  imageController,
  textController,
  tagController
};
