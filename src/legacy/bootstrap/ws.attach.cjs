/**
 * 🌊 WS ATTACHMENT FOR RENDER
 */

const eventStream = require("../realtime/event.stream.cjs");

function attach(server) {
  eventStream.init(server);
  console.log("🌊 WS ATTACHED TO SERVER");
}

module.exports = attach;
