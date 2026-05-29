const Redis = require("redis");

const client = Redis.createClient({
  url: process.env.REDIS_URL
});

client.connect();

/**
 * 🟣 REDIS STREAM BUS (EVENT CORE)
 */
class RedisStreamBus {

  async publish(event, payload) {
    const message = {
      event,
      payload,
      ts: Date.now()
    };

    await client.xAdd(
      "ai:stream:events",
      "*",
      {
        data: JSON.stringify(message)
      }
    );
  }

  async subscribe(handler) {
    const sub = client.duplicate();
    await sub.connect();

    let lastId = "$";

    while (true) {
      const resp = await sub.xRead(
        {
          key: "ai:stream:events",
          id: lastId
        },
        {
          BLOCK: 0
        }
      );

      if (!resp) continue;

      for (const stream of resp) {
        for (const msg of stream.messages) {
          const data = JSON.parse(msg.message.data);
          lastId = msg.id;
          handler(data);
        }
      }
    }
  }
}

module.exports = new RedisStreamBus();
