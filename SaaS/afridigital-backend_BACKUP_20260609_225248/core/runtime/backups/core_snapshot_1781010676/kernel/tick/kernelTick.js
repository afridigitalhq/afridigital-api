const bus = require("../events/eventBus");

function startKernelTick({ interval = 200 }) {
  console.log("🧬 Kernel Tick Loop ACTIVE:", interval + "ms");

  setInterval(() => {
    bus.emit("kernel.tick", {
      ts: Date.now(),
      type: "heartbeat"
    });
  }, interval);
}

module.exports = { startKernelTick };
