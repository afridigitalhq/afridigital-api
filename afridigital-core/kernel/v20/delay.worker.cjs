const { createClient } = require("redis");
const { STREAMS } = require("./stream.core.cjs");

class DelayWorker {
  constructor() {
    this.redis = null;
  }

  async connect() {
    this.redis = createClient({ url: process.env.REDIS_URL });
    await this.redis.connect();
  }

  async start() {
    await this.connect();

    console.log("⏳ Delay Worker Running...");

    while (true) {
      const res = await this.redis.xRead(
        [{ key: "wa:delay", id: ">" }],
        { COUNT: 1, BLOCK: 5000 }
      );

      if (!res) continue;

      for (const stream of res) {
        for (const msg of stream.messages) {
          const data = JSON.parse(msg.message.data);

          await new Promise(r => setTimeout(r, 3000));

          await this.redis.xAdd("wa:outbox", "*", {
            data: JSON.stringify(data)
          });
        }
      }
    }
  }
}

module.exports = DelayWorker;
