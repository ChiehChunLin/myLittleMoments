const Redis = require("ioredis");
const dotenv = require("dotenv").config();
const redisRetry = (times) => {
  if (times % 4 == 0) {
    console.error("Redis error: reconnect exhausted after 3 retries.");
    return null;
  }
  return 200;
};
const redisConfig = [
  {
    password: process.env.REDIS_PASSWORD,
    retryStrategy: redisRetry
  },
  {
    host: process.env.AWS_CACHE_PRIMARY,
    port: process.env.AWS_CACHE_PORT,
    retryStrategy: redisRetry
  }
]
const redisIndex = process.env.REDIS_DATABASE_CONNDB_INDEX;
const redis = new Redis(redisConfig[redisIndex]);

//https://github.com/redis/ioredis/blob/main/examples/



module.exports = redis;