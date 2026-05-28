const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

const STREAM = "whatsapp:stream";

module.exports = {
  async replay(fromId = "-", toId = "+", limit = 50) {
    const res = await redis.xrange(STREAM, fromId, toId, "COUNT", limit);

    return res.map(([id, fields]) => {
      const obj = {};
      for (let i = 0; i < fields.length; i += 2) {
        obj[fields[i]] = fields[i + 1];
      }

      try {
        obj.payload = JSON.parse(obj.payload);
      } catch {}

      return { id, ...obj };
    });
  }
};
