const moment = require("moment");
const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const { babyGender, babyRole, babyActivity } = require("./utils/getBabyConst");
const pool = require("./database/connDB");
const {
  newNativeUser,
  newLineUser,
  setUserFollowBaby
} = require("./database/userDB");
const { newBaby, setBabyDaily } = require("./database/babyDB");
const { setImage } = require("./database/imageDB");

const cherryId = "U9acc24aec8497b5e7159c861f9079b71";
const puffId = 1682294400000;
const puffBirth = "2023-03-24";

function getDateDifference(dateOld, dateNew) {
  const todays = dateNew.split("-");
  const dates = dateOld.split("-");
  const today = moment([todays[0], todays[1], todays[2]]);
  const dateBirth = moment([dates[0], dates[1], dates[2]]);
  const diffDuration = moment.duration(today.diff(dateBirth));
  return `${diffDuration.years()}Y-${diffDuration.months()}M`;
}

async function createUserTable() {
  const userTable = await pool.query(
    `CREATE TABLE IF NOT EXISTS \`users\` (
                \`id\` BIGINT UNSIGNED NOT NULL PRIMARY KEY COMMENT 'User id',
                \`lineId\` VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'User line id',
                \`provider\` VARCHAR(255) NOT NULL COMMENT 'Service Provider',
                \`authRole\` VARCHAR(255) NOT NULL DEFAULT 'user' COMMENT 'User Role',
                \`name\` VARCHAR(255) NOT NULL COMMENT 'User name',
                \`email\` VARCHAR(255) NOT NULL UNIQUE KEY COMMENT 'User email',
                \`password\` VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'User password',
                \`picture\` VARCHAR(255) NOT NULL DEFAULT 'default/defaultUser' COMMENT 'User picture',
                \`timestamp\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
              );`
  );
  if (userTable) {
    return "userTable ok";
  }
}
async function createBabyTable() {
  const babyTable = await pool.query(
    `CREATE TABLE IF NOT EXISTS \`babys\` (
                \`id\` BIGINT UNSIGNED NOT NULL PRIMARY KEY COMMENT 'Baby id',
                \`name\` VARCHAR(255) NOT NULL COMMENT 'Baby name',
                \`gender\` VARCHAR(255) NOT NULL COMMENT 'Baby gender',
                \`birthday\` VARCHAR(255) NOT NULL COMMENT 'Baby birthday',                
                \`headshot\` VARCHAR(255) NOT NULL DEFAULT 'default/defaultBaby' COMMENT 'Baby picture',
                \`cover\` VARCHAR(255) NOT NULL DEFAULT 'default/defaultCover' COMMENT 'Baby banner',
                \`timestamp\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
              );`
  );
  if (babyTable) {
    return "babyTable ok";
  }
}
async function createFollowTable() {
  const followTable = await pool.query(
    `CREATE TABLE IF NOT EXISTS \`follows\` (
                \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Follow id',
                \`userId\` BIGINT UNSIGNED NOT NULL COMMENT 'User id',
                \`babyId\` BIGINT UNSIGNED NOT NULL COMMENT 'Baby id',
                \`babyRole\` VARCHAR(255) NOT NULL COMMENT 'Baby role',
                \`relation\` VARCHAR(255) NOT NULL COMMENT 'Baby relation',
                \`timestamp\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id),
                FOREIGN KEY (babyId) REFERENCES babys(id) ON DELETE CASCADE,
                UNIQUE KEY (userId, babyId)
              );`
  );
  if (followTable) {
    return "followTable ok";
  }
}
async function createImageTable() {
  const imageTable = await pool.query(
    `CREATE TABLE IF NOT EXISTS \`images\` (
                  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Image id',
                  \`userId\` BIGINT UNSIGNED NOT NULL COMMENT 'User id',
                  \`babyId\` BIGINT UNSIGNED NOT NULL COMMENT 'Baby id',
                  \`tag\` VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Image tag',
                  \`type\` VARCHAR(255) NOT NULL DEFAULT 'image' COMMENT 'Image type',
                  \`filename\` VARCHAR(255) NOT NULL COMMENT 'Image full filename',
                  \`timestamp\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Image date in S3',
                  FOREIGN KEY (userId) REFERENCES users(id),
                  FOREIGN KEY (babyId) REFERENCES babys(id) ON DELETE CASCADE,
                  UNIQUE KEY (babyId, filename)
                );`
  );
  if (imageTable) {
    return "imageTable ok";
  }
}
async function createTextTable() {
  const textTable = await pool.query(
    `
      CREATE TABLE IF NOT EXISTS \`texts\` (
                  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Text id',
                  \`userId\` BIGINT UNSIGNED NOT NULL COMMENT 'User id',
                  \`babyId\` BIGINT UNSIGNED NOT NULL COMMENT 'Baby id',
                  \`content\` TEXT NOT NULL COMMENT 'Text content',
                  \`timestamp\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Text date'
                  FOREIGN KEY (userId) REFERENCES users(id),
                  FOREIGN KEY (babyId) REFERENCES babys(id) ON DELETE CASCADE
                );
    `
  );
  if (textTable) {
    return "textTable ok";
  }
}
async function createBabyDailyTable() {
  const babyDailyTable = await pool.query(
    `
      CREATE TABLE IF NOT EXISTS \`babyDaily\` (
                  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Text id',
                  \`userId\` BIGINT UNSIGNED NOT NULL COMMENT 'User id',
                  \`babyId\` BIGINT UNSIGNED NOT NULL COMMENT 'Baby id',
                  \`week\` INT NOT NULL DEFAULT '' COMMENT 'Activity week',
                  \`activity\` VARCHAR(255) NOT NULL COMMENT 'Baby activity',
                  \`quantity\` FLOAT NOT NULL COMMENT 'Baby quantity',
                  \`timestamp\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Living date'
                  FOREIGN KEY (userId) REFERENCES users(id),
                  FOREIGN KEY (babyId) REFERENCES babys(id) ON DELETE CASCADE
                );
    `
  );
  if (babyDailyTable) {
    return "babyDailyTable ok";
  }
}

// const commands = [
//   createUserTable(),
//   createBabyTable(),
//   createFollowTable(),
//   createImageTable(),
//   createTextTable(),
//   createBabyDailyTable(),
//   newNativeUser(
//     pool,
//     "aaa123456",
//     "aaa123456@fakemail.com",
//     "$2b$10$tzcVE8bVVv6k151knLPC1.xuA5GbFpuRtDO3ekKhDsiu85td5i6by",
//     true
//   ),
//   newLineUser(
//     pool,
//     "U1e7165f3c3db2ce3142eb75643c61ec6",
//     "林潔君",
//     "justme11012@gmail.com",
//     "moonday0815",
//     true,
//     cherryId
//   ),
//   newBaby(pool, "puff", babyGender.GIRL, "2023-03-24", puffId)
// ];

// const imgCommands = [
//   setImage(pool, cherryId, puffId, old2, "image", "2024-06-18/513148621525352675"),
//   setImage(pool, cherryId, puffId, old2, "image", "2024-06-18/513148622834499683"),
//   setImage(pool, cherryId, puffId, old2, "image", "2024-06-18/513148623538880651"),
//   setImage(pool, cherryId, puffId, old2, "image", "2024-06-18/513148624075751624"),
//   setImage(pool, cherryId, puffId, old2, "image", "2024-06-18/513148624713285958"),
//   setImage(pool, cherryId, puffId, old2, "image", "2024-06-18/513148625502077219"),
//   setImage(pool, cherryId, puffId, old2, "image", "2024-06-18/513148626592596177"),
//   setImage(pool, cherryId, puffId, old2, "image", "2024-06-18/513148627078611379"),
//   setImage(pool, cherryId, puffId, old2, "image", "2024-06-18/513148627733708916"),
//   setImage(pool, cherryId, puffId, old2, "image", "2024-06-18/513148628471120059")
// ];
// const dailyCommands = [
//   setUserFollowBaby(pool, cherryId, puffId, babyRole.MANAGER, "mama"),
//   setBabyDaily(pool, cherryId, puffId, babyActivity.HEIGHT, 51, "2023-05-01"),
//   setBabyDaily(pool, cherryId, puffId, babyActivity.HEIGHT, 63, "2023-10-02"),
//   setBabyDaily(pool, cherryId, puffId, babyActivity.HEIGHT, 63, "2023-10-02"),
//   setBabyDaily(pool, cherryId, puffId, babyActivity.HEIGHT, 63, "2023-11-02"),
//   setBabyDaily(pool, cherryId, puffId, babyActivity.HEIGHT, 65.5, "2024-01-06"),
//   setBabyDaily(pool, cherryId, puffId, babyActivity.HEIGHT, 69, "2024-06-08"),
//   setBabyDaily(pool, cherryId, puffId, babyActivity.WEIGHT, 3.6, "2023-05-01"),
//   setBabyDaily(pool, cherryId, puffId, babyActivity.WEIGHT, 5.6, "2023-10-02"),
//   setBabyDaily(pool, cherryId, puffId, babyActivity.WEIGHT, 6.3, "2023-11-02"),
//   setBabyDaily(pool, cherryId, puffId, babyActivity.WEIGHT, 6.3, "2023-12-11"),
//   setBabyDaily(pool, cherryId, puffId, babyActivity.WEIGHT, 6.6, "2024-01-06"),
//   setBabyDaily(pool, cherryId, puffId, babyActivity.WEIGHT, 7.1, "2024-05-01"),
//   setBabyDaily(pool, cherryId, puffId, babyActivity.WEIGHT, 7.5, "2024-06-08")
// ];
Promise.all(imgCommands)
  .then((result) => {
    console.log("result %j", result);
  })
  .catch((err) => {
    console.log("Error: " + err.message);
  });
