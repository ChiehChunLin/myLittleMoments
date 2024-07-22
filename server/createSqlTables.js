const moment = require("moment");
const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const pool = require("./database/connDB");


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

const commands = [
  createUserTable(),
  createBabyTable(),
  createFollowTable(),
  createImageTable(),
  createTextTable(),
  createBabyDailyTable()
];

Promise.all(commands)
  .then((result) => {
    console.log("result %j", result);
  })
  .catch((err) => {
    console.log("Error: " + err.message);
  });
