const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

const LANE = "whatsapp:retry:delayed";

module.exports = {
  async schedule(event, delayMs = 5000) {
    const payload = JSON.stringify(event);
    const score = Date.now() + delayMs;

    await redis.zadd(LANE, score, payload);
  },

  async fetchReady() {
    const now = Date.now();

    const items = await redis.zrangebyscore(LANE, 0, now, "LIMIT", 0, 10);
    if (!items.length) return [];

    await redis.zremrangebyscore(LANE, 0, now);

    return items.map(i => JSON.parse(i));
  }
};
