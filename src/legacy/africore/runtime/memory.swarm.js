const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

const STREAM = "afri:memory:stream";

async function broadcast(event, payload) {
  await client.xAdd(STREAM, "*", {
    event,
    data: JSON.stringify(payload)
  });
}

async function listen(group, consumer, handler) {
  while (true) {
    const res = await client.xReadGroup(group, consumer, {
      key: STREAM,
      id: ">"
    }, { COUNT: 10, BLOCK: 5000 });

    if (!res) continue;

    for (const stream of res) {
      for (const msg of stream.messages) {
        const payload = JSON.parse(msg.message.data);
        await handler(payload);
        await client.xAck(STREAM, group, msg.id);
      }
    }
  }
}

module.exports = { broadcast, listen };
