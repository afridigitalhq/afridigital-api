/**
 * 🧠 GOVERNOR HOOK BRIDGE
 * ensures all broadcasts pass through safe layer
 */

const { broadcast } = require("../governor/broadcast.safe");
const { lockRuntime } = require("./runtime.lock");

function init(serverName, wss) {
  if (!lockRuntime(serverName)) return;

  // attach websocket to safe broadcast layer
  if (wss) {
    broadcast.attach(wss);
  }

  console.log("🧠 GOVERNOR HOOK ACTIVE:", serverName);
}

module.exports = {
  init
};
