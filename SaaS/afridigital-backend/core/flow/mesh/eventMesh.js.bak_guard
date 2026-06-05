let memoryBus = {};

let redis = null;

try {
  redis = require("ioredis")();
  console.log("🟢 Redis mesh enabled");
} catch (e) {
  console.log("🟡 Redis unavailable → using in-memory mesh");
}

function publish(channel, event) {
  const payload = JSON.stringify(event);

  // Redis fanout
  if (redis && redis.publish) {
    redis.publish(channel, payload);
  }

  // In-memory fallback fanout
  memoryBus[channel] = memoryBus[channel] || [];
  memoryBus[channel].push(event);

  if (memoryBus[channel].length > 100) {
    memoryBus[channel].shift();
  }
}

function subscribe(channel, handler) {
  if (redis && redis.subscribe) {
    redis.subscribe(channel);
    redis.on("message", (ch, msg) => {
      if (ch === channel) handler(JSON.parse(msg));
    });
  } else {
    // fallback polling stream
    setInterval(() => {
      const events = memoryBus[channel] || [];
      if (events.length) handler(events[events.length - 1]);
    }, 500);
  }
}

module.exports = { publish, subscribe };
