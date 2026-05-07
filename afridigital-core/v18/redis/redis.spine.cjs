const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL);

const channels = {
  events: "afri:events",
  jobs: "afri:jobs",
  payments: "afri:payments",
  fraud: "afri:fraud",
  whatsapp: "afri:whatsapp"
};

function emit(channel, payload) {
  redis.publish(channel, JSON.stringify(payload));
}

function on(channel, handler) {
  const sub = new Redis(process.env.REDIS_URL);
  sub.subscribe(channel);
  sub.on("message", (_, msg) => handler(JSON.parse(msg)));
}

module.exports = { redis, channels, emit, on };
