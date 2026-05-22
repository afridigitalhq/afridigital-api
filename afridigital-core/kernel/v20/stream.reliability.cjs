const { createClient } = require("redis");

class StreamReliability {
  constructor() {
    this.redis = null;

    this.streamIn = "wa:inbox";
    this.streamOut = "wa:outbox";
    this.streamDead = "wa:dead";

    this.group = "wa-group";
    this.consumer = `worker-${Math.random().toString(16).slice(2)}`;
  }

  async connect() {
    this.redis = createClient({ url: process.env.REDIS_URL });
    await this.redis.connect().catch(e => console.log("Redis retry"));

    // Create consumer group safely (ignore errors if exists)
    try {
      await this.redis.xGroupCreate(this.streamIn, this.group, "0", { MKSTREAM: true });
    } catch (e) {}

    console.log("🧠 RELIABILITY LAYER ACTIVE");
  }

  async readInbox() {
    return this.redis.xReadGroup(
      this.group,
      this.consumer,
      [{ key: this.streamIn, id: "$" }],
      { COUNT: 1, BLOCK: 5000 }
    );
  }

  async ack(msgId) {
    await this.redis.xAck(this.streamIn, this.group, msgId);
  }

  async moveToDead(letter, reason) {
    await this.redis.xAdd(this.streamDead, "*", {
      data: JSON.stringify({ letter, reason, ts: Date.now() })
    });
  }
}

module.exports = StreamReliability;
