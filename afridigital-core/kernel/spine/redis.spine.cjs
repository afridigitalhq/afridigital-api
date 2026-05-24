const Redis = require("ioredis");

const pub = new Redis(process.env.REDIS_URL);
const sub = new Redis(process.env.REDIS_URL);

const CHANNEL = "AFRIDIGITAL_EVENT_SPINE";

function emit(event, payload = {}) {
  const packet = JSON.stringify({ event, payload, ts: Date.now() });
  pub.publish(CHANNEL, packet);
  console.log("📡 [REDIS EMIT]", event);
}

function on(eventFilter, handler) {
  sub.subscribe(CHANNEL);

  sub.on("message", (_, msg) => {
    const data = JSON.parse(msg);
    if (!eventFilter || data.event === eventFilter) {
      handler(data.payload);
    }
  });
}

module.exports = { emit, on };
