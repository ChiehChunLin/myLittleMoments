const { authProvider, authRole } = require("../utils/getAuthConst");
const { getUTCTime } = require("../utils/getFormattedDate");

async function newNativeUser(
  conn,
  name,
  email,
  password,
  isAdmin = false,
  id = 0
) {
  const userId = id == 0 ? getUTCTime() : id;
  const role = isAdmin ? authRole.ADMIN : authRole.USER;
  const [rows] = await conn.query(
    `
      INSERT INTO users (id, provider, authRole, name, email, password)
      VALUES (?,?,?,?,?,?)
    `,
    [userId, authProvider.NATIVE, role, name, email, password]
  );
  // console.log("newUser:" + JSON.stringify(rows));
  if (rows.length == 0 || !rows.insertId) {
    return undefined;
  } else {
    const user_id = rows.insertId;
    return getUser(user_id);
  }
}
async function newLineUser(
  conn,
  lineId,
  name,
  email,
  password,
  isAdmin = false,
  id = 0
) {
  const userId = id == 0 ? getUTCTime() : id;
  const role = isAdmin ? authRole.ADMIN : authRole.USER;
  const [rows] = await conn.query(
    `
      INSERT INTO users (id, lineId, provider, authRole, name, email, password)
      VALUES (?,?,?,?,?,?,?)
    `,
    [userId, lineId, authProvider.LINE, role, name, email, password]
  );
  // console.log("newUser:" + JSON.stringify(rows));
  if (rows.length == 0 || !rows.insertId) {
    return undefined;
  } else {
    const user_id = rows.insertId;
    return getUser(user_id);
  }
}
async function getUser(conn, id) {
  const [rows] = await conn.query(
    `
      SELECT * FROM users where id = ?
    `,
    [id]
  );
  if (rows.length == 0) {
    return undefined;
  } else {
    return rows[0];
  }
}
async function getUserByEmail(conn, email) {
  const [rows] = await conn.query(
    `
      SELECT * FROM users where email = ?
    `,
    [email]
  );
  if (rows.length == 0) {
    return undefined;
  } else {
    return rows[0];
  }
}
async function setUserFollowBaby(conn, userId, babyId, babyRole, relation) {
  const [rows] = await conn.query(
    `
      INSERT INTO follows (userId, babyId, babyRole, relation)
      VALUES (?,?,?,?)
    `,
    [userId, babyId, babyRole, relation]
  );
  // console.log("setUserFollowBaby:" + JSON.stringify(rows));
  if (rows.length == 0 || !rows.insertId) {
    return undefined;
  } else {
    return rows.insertId;
  }
}
module.exports = {
  newNativeUser,
  newLineUser,
  getUser,
  getUserByEmail,
  setUserFollowBaby
};
