const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

const STREAM = "whatsapp:stream";

module.exports = {
  async publish(event) {
    await redis.xadd(
      STREAM,
      "*",
      "data",
      JSON.stringify(event)
    );
  }
};
