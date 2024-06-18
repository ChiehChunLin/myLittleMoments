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
  // console.log("newNativeUser:" + JSON.stringify(rows));
  return await getUser(conn, userId);
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
  // console.log("newLineUser:" + JSON.stringify(rows));
  return await getUser(conn, userId);
}
async function getUser(conn, id) {
  const [rows] = await conn.query(
    `
      SELECT * FROM users where id = ?
    `,
    [id]
  );
  // console.log("getUser:" + JSON.stringify(rows[0]));
  return rows[0];
}
async function getUserByEmail(conn, email) {
  const [rows] = await conn.query(
    `
      SELECT 
        u.id AS id,
        u.lineId AS lineId,
        u.authRole AS authRole,
        u.email AS userEmail,
        u.password AS password,
        u.picture AS picture,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', b.id,
                'name', b.name,
                'headshot', b.headshot,
                'userRole', f.babyRole
            )
        ) AS follows
        FROM users u
        JOIN follows f ON u.id = f.userId
        JOIN babys b ON f.babyId = b.id
        WHERE u.email = ?;
    `,
    [email]
  );
  // console.log("getUserByEmail:" + JSON.stringify(rows[0]));
  return rows[0];
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
  return rows.insertId;
}

module.exports = {
  newNativeUser,
  newLineUser,
  getUser,
  getUserByEmail,
  setUserFollowBaby
};
