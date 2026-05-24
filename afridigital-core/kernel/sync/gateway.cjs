const ai = require("../ai/engine.cjs");
const bus = require("../v15/bus.cjs");

function handleMessage(msg) {
  console.log("\n📨 MESSAGE RECEIVED:", msg);

  const response = ai.respond(msg);

  return {
    reply: response,
    source: bus.services.frontend
  };
}

module.exports = { handleMessage };
