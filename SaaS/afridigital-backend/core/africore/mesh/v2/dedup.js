const Redis = require("ioredis");
const redis = new (require("../redis/disabledClient"))();

const SET = "whatsapp:dedup";
const TTL = 60 * 60 * 24;

module.exports = {
  async seen(id) {
    return await redis.sismember(SET, id);
  },

  async mark(id) {
    await redis.sadd(SET, id);
    await redis.expire(SET, TTL);
  }
};
