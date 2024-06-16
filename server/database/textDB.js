const moment = require("moment");
const { getLogTimeFormat } = require("../utils/getFormattedDate");

async function setText(conn, userId, babyId, content, date = "") {
  const textDate = date == "" ? getLogTimeFormat() : date;
  const [rows] = await conn.query(
    `
     INSERT INTO texts (userId, babyId, content, timestamp)
     VALUES (?,?,?,?)
    `,
    [userId, babyId, content, textDate]
  );
  // console.log("setImage:" + JSON.stringify(rows));
  if (rows.length == 0 || !rows.insertId) {
    return undefined;
  } else {
    return rows.insertId;
  }
}
async function getTextByMonth(conn, babyId, date) {
  const addMonth = moment(date).add(1, "M").format("YYYY-MM-DD");
  const [rows] = await conn.query(
    `
     SELECT * FROM texts 
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
async function getTextByDate(conn, babyId, date) {
  const [rows] = await conn.query(
    `
     SELECT * FROM texts 
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
  setText,
  getTextByMonth,
  getTextByDate
};
