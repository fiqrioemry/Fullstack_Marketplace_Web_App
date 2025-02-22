const Redis = require('ioredis');
const dotenv = require('dotenv');
dotenv.config();

const { REDIS_PORT, DB_HOST } = process.env;

const redis = new Redis({
  host: DB_HOST,
  port: REDIS_PORT,
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis on port :', REDIS_PORT);
});

redis.on('error', (error) => {
  console.error('❌ Redis connection error:', error);
});

module.exports = redis;
