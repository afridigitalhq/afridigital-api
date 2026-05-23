const { createClient } = require("redis");

class RedisConsumerSetup {
  constructor() {
    this.redis = null;
    this.stream = "wa:inbox";
    this.group = "wa-group";
    this.consumer = "worker-1";
  }

  async connect() {
    this.redis = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
    await this.redis.connect().catch(e => console.log("Redis retry")).catch(() => {});
const { ensureStreams } = require("./redis.stream.guard.cjs"); await ensureStreams(this.redis);
  }

  async initGroup() {
    try {
      await this.redis.xGroupCreate(this.stream, this.group, "0", {
        MKSTREAM: true
      });
      console.log("🧠 Consumer Group Created");
    } catch (e) {
      console.log("🧠 Consumer Group Exists");
    }
  }

  async ack(id) {
    await this.redis.xAck(this.stream, this.group, id);
  }
}

module.exports = RedisConsumerSetup;
