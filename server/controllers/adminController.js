const conn = require("../database/connDB");
const userDB = require("../database/userDB");
const babyDB = require("../database/babyDB");
const imageDB = require("../database/imageDB");
const dailyData = require("../utils/babyDailyData");

const lineUserList = async (req,res,next)=>{
  try {
    const lineUserList = await userDB.getLineUserList(conn);
    res.status(200).send({ lineUserList });
  } catch (error) {
    next(error);
  }
}
module.exports = { lineUserList };
