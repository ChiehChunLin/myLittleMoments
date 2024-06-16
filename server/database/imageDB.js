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
  if (rows.length == 0 || !rows.insertId) {
    return undefined;
  } else {
    return rows.insertId;
  }
}
async function getImageByTag(conn, babyId, tag) {
  const [rows] = await conn.query(
    `
      SELECT * FROM images WHERE babyId = ? AND tag = ? 
      ORDER BY timestamp DESC
    `,
    [babyId, tag]
  );
  if (rows.length == 0) {
    return undefined;
  } else {
    return rows;
  }
}
async function getImageByMonth(conn, babyId, date) {
  const addMonth = moment(date).add(1, "M").format("YYYY-MM-DD");
  const [rows] = await conn.query(
    `
     SELECT * FROM images 
     WHERE babyId = ? AND timestamp >= ? AND timestamp <= ?
     ORDER BY timestamp DESC
    `,
    [babyId, `${date} 00:00:00`, `${addMonth} 00:00:00`]
  );
  if (rows.length == 0) {
    return undefined;
  } else {
    return rows;
  }
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
  if (rows.length == 0) {
    return undefined;
  } else {
    return rows;
  }
}
module.exports = {
  setImage,
  getImageByTag,
  getImageByMonth,
  getImageByDate
};
