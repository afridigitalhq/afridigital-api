const bus = require("../events/eventBus");

function attachFlowBridge(flowEngine) {
  bus.on("kernel.tick", async (tick) => {
    if (!flowEngine) return;

    try {
      flowEngine.onTick?.(tick);
    } catch (e) {
      console.log("⚠️ Flow tick error:", e.message);
    }
  });
}

module.exports = { attachFlowBridge };
