const bus = require("./controlBus");
const registry = require("./registry");

function initControlPlane() {
  console.log("🧠 CONTROL PLANE ONLINE");

  bus.stream((event) => {
    registry.streams.push(event);
  });

  return { bus, registry };
}

module.exports = { initControlPlane };
