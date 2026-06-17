let redis = null;
let memoryBus = new Map();

try {
  redis = require("../../redis/streamBus");
} catch (e) {
  console.log("Redis unavailable → using memory mesh");
}

function publish(channel, data) {
  if (redis && redis.publish) {
    redis.publish(channel, data);
  } else {
    if (!memoryBus.has(channel)) memoryBus.set(channel, []);
    memoryBus.get(channel).push(data);
  }
}

function subscribe(channel, cb) {
  if (redis && redis.subscribe) {
    redis.subscribe(channel, cb);
  } else {
    setInterval(() => {
      const events = memoryBus.get(channel) || [];
      while (events.length) cb(events.shift());
    }, 500);
  }
}

module.exports = { publish, subscribe };
