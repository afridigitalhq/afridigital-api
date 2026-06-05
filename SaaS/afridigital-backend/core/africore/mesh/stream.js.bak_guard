const Redis = require("ioredis");
const redis = new (require("../redis/disabledClient"))();

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
