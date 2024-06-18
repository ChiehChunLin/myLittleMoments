const moment = require("moment");
const { getLogTimeFormat } = require("../utils/getFormattedDate");

async function setImage(conn, userId, babyId, type, filename, date = "") {
  const imageDate = date == "" ? getLogTimeFormat() : date;
  const [rows] = await conn.query(
    `
     INSERT INTO images (userId, babyId, type, filename, timestamp)
     VALUES (?,?,?,?,?)
    `,
    [userId, babyId, type, filename, imageDate]
  );
  // console.log("setImage:" + JSON.stringify(rows));
  return rows.insertId;
}
async function getImageByTag(conn, babyId, tag) {
  const [rows] = await conn.query(
    `
      SELECT * FROM images WHERE babyId = ? AND tag = ? 
      ORDER BY timestamp DESC
    `,
    [babyId, tag]
  );
  // console.log("getImageByTag:" + JSON.stringify(rows));
  return rows;
}
async function getImageByMonth(conn, babyId, date) {
  const addMonth = moment(date).add(1, "M").format("YYYY-MM-DD");
  const [rows] = await conn.query(
    `
      SELECT
        DATE_FORMAT(date, '%Y-%m-%d') as date,
        JSON_ARRAYAGG(filename) as images
      FROM (
        SELECT
          DATE(timestamp) as date,
          filename
        FROM
          images
        WHERE
          babyId = 1682294400000 AND timestamp BETWEEN '2024-06-01' AND '2024-07-01'
        ORDER BY
          DATE(timestamp), timestamp
        ) as ordered_images
      GROUP BY
        date;
    `,
    [babyId, `${date} 00:00:00`, `${addMonth} 00:00:00`]
  );
  // console.log("getImageByMonth:" + JSON.stringify(rows));
  return rows;
}
async function getImageByDate(conn, babyId, date) {
  const [rows] = await conn.query(
    `
     SELECT * FROM images 
     WHERE babyId = ? AND timestamp >= ? AND timestamp <= ?
     ORDER BY timestamp DESC
    `,
    [babyId, `${date} 00:00:00`, `${date} 23:59:59`]
  );
  // console.log("getImageByDate:" + JSON.stringify(rows));
  return rows;
}
module.exports = {
  setImage,
  getImageByTag,
  getImageByMonth,
  getImageByDate
};
