const Redis = require("ioredis");
const bus = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

console.log("🔴 V19 EVENT SPINE ACTIVE");

function emit(event, payload) {
  bus.publish("afridigital-events", JSON.stringify({ event, payload, ts: Date.now() }));
}

module.exports = { bus, emit };
