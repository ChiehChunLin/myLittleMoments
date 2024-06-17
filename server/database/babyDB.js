const { babyActivity } = require("../utils/getBabyConst");
const {
  getUTCTime,
  getWeekNumberByDate
} = require("../utils/getFormattedDate");

async function newBaby(conn, name, gender, birthday, id = 0) {
  const babyId = id == 0 ? getUTCTime() : id;
  const [rows] = await conn.query(
    `
      INSERT INTO babys (id, name, gender, birthday)
      VALUES (?,?,?,?)
    `,
    [babyId, name, gender, birthday]
  );
  // console.log("newBaby:" + JSON.stringify(rows));
  return await getBaby(conn, babyId);
}
async function getBaby(conn, id) {
  const [rows] = await conn.query(
    `
      SELECT * FROM babys WHERE id = ?
    `,
    [id]
  );
  // console.log("getBaby:" + JSON.stringify(rows[0]));
  return rows[0];
}

async function setBabyDaily(conn, userId, babyId, activity, quantity, date) {
  const activityDate = date == "" ? getLogTimeFormat() : date;
  const week = getWeekNumberByDate(activityDate);
  const [rows] = await conn.query(
    `
      INSERT INTO babyDaily (userId, babyId, week, activity, quantity, timestamp)
      VALUES (?,?,?,?,?,?)
    `,
    [userId, babyId, week, activity, quantity, activityDate]
  );
  // console.log("setBabyDaily:" + JSON.stringify(rows));
  return rows.insertId;
}
async function getBabyDailyWeek(conn, babyId, date) {
  const week = getWeekNumberByDate(date);
  const [rows] = await conn.query(
    `
      SELECT * FROM babyDaily 
      WHERE babyId = ? AND week = ?
      AND activity <> ${babyActivity.HEIGHT} AND activity <> ${babyActivity.WEIGHT}
    `,
    [babyId, week]
  );
  // console.log("getBabyDailyWeek:" + JSON.stringify(rows));
  return rows;
}
async function getBabyWeightData(conn, babyId) {
  const [rows] = await conn.query(
    `
      SELECT quantity, timestamp FROM babyDaily 
      WHERE babyId = ? AND activity = ${babyActivity.WEIGHT}
    `,
    [babyId]
  );
  // console.log("getBabyWeightData:" + JSON.stringify(rows));
  return rows;
}
async function getBabyHeightData(conn, babyId) {
  const [rows] = await conn.query(
    `
      SELECT quantity, timestamp FROM babyDaily 
      WHERE babyId = ? AND activity = ${babyActivity.HEIGHT}
    `,
    [babyId]
  );
  // console.log("getBabyHeightData:" + JSON.stringify(rows));
  return rows;
}
module.exports = {
  newBaby,
  getBaby,
  setBabyDaily,
  getBabyDailyWeek,
  getBabyWeightData,
  getBabyHeightData
};
