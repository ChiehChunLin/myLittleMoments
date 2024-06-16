const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const { babyGender, babyRole } = require("./utils/getBabyConst");
const pool = require("./database/connDB");
const {
  newNativeUser,
  newLineUser,
  setUserFollowBaby
} = require("./database/userDB");
const { newBaby } = require("./database/babyDB");

async function createUserTable() {
  const userTable = await pool.query(
    `CREATE TABLE IF NOT EXISTS \`users\` (
                \`id\` BIGINT UNSIGNED NOT NULL PRIMARY KEY COMMENT 'User id',
                \`lineId\` VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'User line id',
                \`provider\` VARCHAR(255) NOT NULL COMMENT 'Service Provider',
                \`authRole\` VARCHAR(255) NOT NULL DEFAULT 'user' COMMENT 'User Role',
                \`name\` VARCHAR(255) NOT NULL COMMENT 'User name',
                \`email\` VARCHAR(255) NOT NULL UNIQUE KEY COMMENT 'User email',
                \`password\` VARCHAR(255) NOT NULL COMMENT 'User password',
                \`picture\` VARCHAR(255) NOT NULL DEFAULT 'default/defaultUser' COMMENT 'User picture',
                \`timestamp\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
              );`
  );
  if (userTable) console.log("userTable is ready for service.");
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
  if (babyTable) console.log("babyTable is ready for service.");
}
async function createFollowTable() {
  const followTable = await pool.query(
    `CREATE TABLE IF NOT EXISTS \`follows\` (
                \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Follow id',
                \`userId\` BIGINT UNSIGNED NOT NULL COMMENT 'User id',
                \`babyId\` BIGINT UNSIGNED NOT NULL COMMENT 'Baby id',
                \`babyRole\` VARCHAR(255) NOT NULL COMMENT 'Baby role',
                \`relation\` BIGINT UNSIGNED NOT NULL COMMENT 'Baby relation',
                UNIQUE KEY (userId, babyId)
              );`
  );
  if (followTable) console.log("followTable is ready for service.");
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
                  UNIQUE KEY (babyId, filename)
                );`
  );
  if (imageTable) console.log("imageTable is ready for service.");
}
async function createTextTable() {
  const textTable = await pool.query(
    `CREATE TABLE IF NOT EXISTS \`texts\` (
                  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Text id',
                  \`userId\` BIGINT UNSIGNED NOT NULL COMMENT 'User id',
                  \`babyId\` BIGINT UNSIGNED NOT NULL COMMENT 'Baby id',
                  \`content\` TEXT NOT NULL COMMENT 'Text content',
                  \`timestamp\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Text date'
                );`
  );
  if (textTable) console.log("textTable is ready for service.");
}
async function createBabyDailyTable() {
  const babyDailyTable = await pool.query(
    `CREATE TABLE IF NOT EXISTS \`babyDaily\` (
                  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Text id',
                  \`userId\` BIGINT UNSIGNED NOT NULL COMMENT 'User id',
                  \`babyId\` BIGINT UNSIGNED NOT NULL COMMENT 'Baby id',
                  \`week\` INT NOT NULL COMMENT 'Activity week',
                  \`activity\` VARCHAR(255) NOT NULL COMMENT 'Baby activity',
                  \`quantity\` INT NOT NULL COMMENT 'Baby quantity',
                  \`timestamp\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Living date'
                );`
  );
  if (babyDailyTable) console.log("babyDailyTable is ready for service.");
}
createUserTable();
createBabyTable();
createFollowTable();
createImageTable();
createTextTable();
createBabyDailyTable();

const commands = [
  newNativeUser(
    pool,
    "aaa123456",
    "aaa123456@fakemail.com",
    "$2b$10$tzcVE8bVVv6k151knLPC1.xuA5GbFpuRtDO3ekKhDsiu85td5i6by",
    true,
    0
  ),
  newLineUser(
    pool,
    "U1e7165f3c3db2ce3142eb75643c61ec6",
    "林潔君",
    "justme11012@gmail.com",
    "moonday0815",
    true,
    657590400000
  ),
  newBaby(pool, "puff", babyGender.GIRL, "2024-03-24", 1682294400000),
  setUserFollowBaby(pool, 657590400000, 1682294400000, babyRole.MANAGER, "mama")
];
Promise.all(commands)
  .then((result) => {
    console.log("result %j", result);
  })
  .catch((err) => {
    console.log("Error: " + err.message);
  });
