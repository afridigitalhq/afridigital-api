const Redis = require("ioredis");
const redis = new (require("../redis/disabledClient"))();

const STREAM = "whatsapp:stream";

module.exports = {
  async buildContext(userId, limit = 20) {
    const res = await redis.xrevrange(STREAM, "+", "-", "COUNT", 200);

    const events = res
      .map(([id, fields]) => {
        const obj = {};
        for (let i = 0; i < fields.length; i += 2) {
          obj[fields[i]] = fields[i + 1];
        }
        try { obj.payload = JSON.parse(obj.payload); } catch {}
        return obj;
      })
      .filter(e => e.user === userId)
      .slice(0, limit);

    return {
      userId,
      messages: events.reverse()
    };
  }
};
