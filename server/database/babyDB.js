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
  return babyId;
}
async function getBaby(conn, id) {
  const [rows] = await conn.query(
    `
      SELECT 
        b.id AS id,
        b.name AS name,
        b.birthday AS birthday,
        b.headshot AS headshot,
        b.cover AS cover,
        COUNT(*) AS followed
      FROM babys b
      JOIN follows f ON b.id = f.babyId
      WHERE b.id = ?
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
      SELECT 
        DATE(timestamp) AS date,
        SUM(CASE WHEN activity = '${babyActivity.MILK}' THEN quantity ELSE 0 END) AS dailyMilk,
        SUM(CASE WHEN activity = '${babyActivity.FOOD}' THEN quantity ELSE 0 END) AS dailyFood,
        SUM(CASE WHEN activity = '${babyActivity.SLEEP}' THEN quantity ELSE 0 END) AS dailySleep,
        SUM(CASE WHEN activity = '${babyActivity.MEDICINE}' THEN quantity ELSE 0 END) AS dailyMedicine,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'starttime', timestamp,
                'activity', activity,
                'quantity', quantity
            )
        ) AS daily
      FROM babyDaily
      WHERE babyId = ? AND week = ? 
            AND  activity != '${babyActivity.HEIGHT}' AND activity != '${babyActivity.WEIGHT}'           
      GROUP BY DATE(timestamp)
      ORDER BY DATE(timestamp) ASC;
    `,
    [babyId, week]
  );
  // console.log("getBabyDailyWeek:" + JSON.stringify(rows));
  return rows;
}
async function getBabyWeightData(conn, babyId) {
  const [rows] = await conn.query(
    `
      SELECT
        b.name,
        b.gender,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                '${babyActivity.WEIGHT}', ROUND(ordered_bd.quantity, 1),
                'age', ROUND(DATEDIFF(ordered_bd.timestamp, b.birthday) / 30.41, 1)
            )
        ) AS ${babyActivity.WEIGHT}s
      FROM
        babys b
      JOIN (
        SELECT *,
              ROUND(DATEDIFF(timestamp, (SELECT birthday FROM babys WHERE id = ?)) / 30.41, 1) AS calculated_age
        FROM babyDaily
        WHERE babyId = ? AND activity = '${babyActivity.WEIGHT}'
        ORDER BY calculated_age
      ) ordered_bd ON b.id = ordered_bd.babyId
      WHERE
        b.id = ?
      GROUP BY
        b.name, b.gender;
    `,
    [babyId, babyId, babyId]
  );
  // console.log("getBabyWeightData:" + JSON.stringify(rows[0]));
  return rows[0];
}
async function getBabyHeightData(conn, babyId) {
  const [rows] = await conn.query(
    `
      SELECT
        b.name,
        b.gender,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                '${babyActivity.HEIGHT}', ROUND(ordered_bd.quantity, 1),
                'age', ROUND(DATEDIFF(ordered_bd.timestamp, b.birthday) / 30.41, 1)
            )
        ) AS ${babyActivity.HEIGHT}s
      FROM
        babys b
      JOIN (
        SELECT *,
              ROUND(DATEDIFF(timestamp, (SELECT birthday FROM babys WHERE id = ?)) / 30.41, 1) AS calculated_age
        FROM babyDaily
        WHERE babyId = ? AND activity = '${babyActivity.HEIGHT}'
        ORDER BY calculated_age
      ) ordered_bd ON b.id = ordered_bd.babyId
      WHERE
        b.id = ?
      GROUP BY
        b.name, b.gender;
    `,
    [babyId, babyId, babyId]
  );
  // console.log("getBabyHeightData:" + JSON.stringify(rows[0]));
  return rows[0];
}

async function updateBabyHeadshot(conn, babyId, headshot) {
  const [rows] = await conn.query(
    `
      UPDATE babys SET headshot = ? WHERE id = ?
    `,
    [headshot, babyId]
  );
  // console.log("babyHead:" + JSON.stringify(rows[0]));
  return rows[0];
}
async function updateBabyCover(conn, babyId, cover) {
  const [rows] = await conn.query(
    `
      UPDATE babys SET cover = ? WHERE id = ?
    `,
    [cover, babyId]
  );
  // console.log("babyCover:" + JSON.stringify(rows[0]));
  return rows[0];
}
module.exports = {
  newBaby,
  getBaby,
  setBabyDaily,
  getBabyDailyWeek,
  getBabyWeightData,
  getBabyHeightData,
  updateBabyHeadshot,
  updateBabyCover
};
