const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

const STREAM_KEY = "afri:swarm:stream";

async function publish(event, payload) {
  await client.xAdd(STREAM_KEY, "*", {
    event,
    data: JSON.stringify(payload)
  });
}

async function consume(group, consumer, handler) {
  while (true) {
    const data = await client.xReadGroup(group, consumer, {
      key: STREAM_KEY,
      id: ">"
    }, { COUNT: 10, BLOCK: 5000 });

    if (!data) continue;

    for (const stream of data) {
      for (const message of stream.messages) {
        const payload = JSON.parse(message.message.data);
        await handler(payload);
        await client.xAck(STREAM_KEY, group, message.id);
      }
    }
  }
}

module.exports = { publish, consume };
