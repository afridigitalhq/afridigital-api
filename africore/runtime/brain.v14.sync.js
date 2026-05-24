const cluster = require("./cluster.mesh");
const federation = require("./federation.mesh");

async function syncMemory(event, payload) {
  await cluster.publishEvent(event, payload);
  await federation.broadcast(event, payload);
}

module.exports = { syncMemory };
