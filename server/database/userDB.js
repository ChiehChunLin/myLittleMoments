const { authProvider, authRole } = require("../utils/getAuthConst");
const { babyRole } = require("../utils/getBabyConst");
const { getUTCTime } = require("../utils/getFormattedDate");

async function newNativeUser(conn, name, email, password, id = 0) {
  const userId = id === 0 ? getUTCTime() : id;
  const [rows] = await conn.query(
    `
      INSERT INTO users (id, provider, name, email, password)
      VALUES (?,?,?,?,?)
    `,
    [userId, authProvider.NATIVE, name, email, password]
  );
  // console.log("newNativeUser:" + JSON.stringify(rows));
  return await getUser(conn, userId);
}
async function newLineUser(conn, lineId, name, email, picture, id = 0) {
  const userId = id === 0 ? getUTCTime() : id;
  const [rows] = await conn.query(
    `
      INSERT INTO users (id, lineId, provider, authRole, name, email, password, picture)
      VALUES (?,?,?,?,?,?,?,?)
    `,
    [userId, lineId, authProvider.LINE, authRole.USER, name, email, "", picture]
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
      SELECT * FROM users where email = ?
    `,
    [email]
  );
  // console.log("getUserByEmail:" + JSON.stringify(rows[0]));
  return rows[0];
}
async function getUserInfo(conn, id) {
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
                'birthday', b.birthday,
                'name', b.name,
                'cover', b.cover,
                'headshot', b.headshot,
                'userRole', f.babyRole
            )
        ) AS follows
        FROM users u
        JOIN follows f ON u.id = f.userId
        JOIN babys b ON f.babyId = b.id
        WHERE u.id = ?;
    `,
    [id]
  );
  // console.log("getUserInfo:" + JSON.stringify(rows[0]));
  return rows[0];
}
async function getUserManagerBabyInfo(conn, id){
  const [rows] = await conn.query(
    `
      SELECT 
          f.babyId,
          b.name AS babyName,
          b.headshot AS babyHeadshot,
          (
              SELECT JSON_ARRAYAGG(JSON_OBJECT('userId', uf.userId, 'userName', u.name))
              FROM follows uf
              JOIN users u ON uf.userId = u.id
              WHERE uf.babyId = f.babyId 
              AND uf.babyRole = '${babyRole.MANAGER}'
              AND uf.userId != ?
          ) AS otherManagers,
          (
              SELECT JSON_ARRAYAGG(JSON_OBJECT('userId', uf.userId, 'userName', u.name))
              FROM follows uf
              JOIN users u ON uf.userId = u.id
              WHERE uf.babyId = f.babyId 
              AND uf.babyRole != '${babyRole.MANAGER}'
              AND uf.userId != ?
          ) AS otherFollows
      FROM 
          follows f
      JOIN 
          babys b ON f.babyId = b.id
      WHERE 
          f.userId = ? 
          AND f.babyRole = '${babyRole.MANAGER}';
    `,
    [id, id, id]
  );
  // console.log("getUserManagerBabyInfo:" + JSON.stringify(rows));
  return rows;
}
async function getUserFollowsBabyList(conn, id){
  const [rows] = await conn.query(
    `
      SELECT 
          f.babyId, 
          b.name AS babyName, 
          b.headshot AS babyHeadshot
      FROM 
          follows f
      JOIN 
          babys b ON f.babyId = b.id
      WHERE 
          f.userId = ? 
          AND f.babyRole != '${babyRole.MANAGER}';
    `,
    [id]
  );
  // console.log("getUserFollowsBabyList:" + JSON.stringify(rows));
  return rows;
}
async function getLineUserList(conn) {
  const [rows] = await conn.query(
    `
      SELECT id,lineId,name FROM users where provider = 'line'
    `,
  );
  // console.log("getLineUserList:" + JSON.stringify(rows));
  return rows;
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
async function getUserFollowsByLineID(conn, lineId, funcDB){
  const condiction = ( funcDB == funcDB.GET_MAIN_BABYS) ? `AND follows.babyRole = 'manager'` : ``;
  const [rows] = await conn.query(
   `
     SELECT
         follows.userId AS userId,
         JSON_ARRAYAGG(
             JSON_OBJECT(
                 'babyId', follows.babyId,
                 'babyRole', follows.babyRole
             )
         ) AS babys
     FROM 
         users
     JOIN 
         follows ON users.id = follows.userId
     WHERE 
         users.lineId = ? ${condiction}
     GROUP BY
         follows.userId; 
   `,
   [lineId]
 );
 // console.log("getManagerBabyList:" + JSON.stringify(rows));
 return rows;
}
async function getUserManagerBabys(conn, userId){
  const [rows] = await conn.query(
    `
      SELECT
        babyId
      FROM 
        follows
      WHERE 
        userId = ? AND babyRole = '${babyRole.MANAGER}'
    `,
    [userId]
  );
  // console.log("getManagerBabyList:" + JSON.stringify(rows));
  return rows;
}

module.exports = {
  newNativeUser,
  newLineUser,
  getUser,
  getUserByEmail,
  getUserInfo,
  getUserManagerBabyInfo,
  getUserFollowsBabyList,
  getLineUserList,
  setUserFollowBaby,
  getUserFollowsByLineID,
  getUserManagerBabys
};
