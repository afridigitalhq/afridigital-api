const redis = require("../redis/redis.cluster.cjs");

console.log("\n📡 EVENT MESH ACTIVE (PUB/SUB)\n");

function publish(event, payload) {
  redis.publish(event, JSON.stringify(payload));
}

function subscribe(event, handler) {
  redis.subscribe(event);
  redis.on("message", (channel, message) => {
    if (channel === event) handler(JSON.parse(message));
  });
}

module.exports = { publish, subscribe };
