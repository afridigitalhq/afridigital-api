const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

const STREAM = "whatsapp:stream";

module.exports = {
  STREAM,

  async publish(event) {
    const userKey = event.from || "unknown";

    return redis.xadd(
      STREAM,
      "*",
      "user", userKey,
      "payload", JSON.stringify(event)
    );
  }
};
