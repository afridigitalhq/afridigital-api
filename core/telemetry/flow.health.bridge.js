
const physics = require('../control-plane/physics/flow.physics.engine');
const { emitAdminEvent } = require("../../realtime/admin-stream");
const os = require("os");

let lastMetrics = null;

/**
 * NORMALIZED LOAD (0 → 1)
 */
function normalize(value, max) {
  return Math.min(1, value / max);
}

/**
 * Convert system health → graph node state
 */
function computeNodePulse(metrics) {
  const cpu = metrics.cpu.load1;
  const mem = metrics.memory.heapUsed / metrics.system.totalMem;
  const events = metrics.aiBrain.events;
  const errors = metrics.aiBrain.errors;

  const intensity =
    normalize(cpu, 4) * 0.35 +
    normalize(mem, 1) * 0.35 +
    normalize(events, 50) * 0.2 +
    normalize(errors, 10) * 0.1;

  return {
    intensity: Math.min(1, intensity),
    glow: intensity > 0.7 ? "red" : intensity > 0.4 ? "amber" : "cyan",
    pulseRate: 500 - Math.floor(intensity * 400),
    jitter: intensity * 10
  };
}

/**
 * MAIN BRIDGE: called by health engine
 */
function pushFlowGraphHealth(metrics) {
  lastMetrics = metrics;

  const pulse = computeNodePulse(metrics);

  emitAdminEvent("FLOW_GRAPH_HEALTH", {
    type: "NODE_PULSE_UPDATE",
    stage: "live",
    traceId: "flow-health",
    payload: {
      system: metrics,
      pulse
    }
  });
}

/**
 * Hook into existing health stream if present
 */
function attachFlowHealthBridge(healthModule) {
  if (!healthModule || !healthModule.startHealthStream) {
    console.log("⚠️ Health module missing");
    return;
  }

  const original = healthModule.startHealthStream;

  healthModule.startHealthStream = function (interval = 3000) {
    console.log("🌐 FLOW GRAPH HEALTH BRIDGE ACTIVE");

    setInterval(() => {
      const metrics = {
        ts: Date.now(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: os.loadavg(),
        system: {
          platform: os.platform(),
          totalMem: os.totalmem(),
          freeMem: os.freemem()
        },
        aiBrain: {
          events: global.__eventCount || 0,
          errors: global.__errorCount || 0
        }
      };

      pushFlowGraphHealth(metrics);
    }, interval);

    return original(interval);
  };
}

module.exports = {
  pushFlowGraphHealth,
  attachFlowHealthBridge
};


// ===== FLOW PHYSICS INTEGRATION =====
function pushFlowGraphHealth(event) {
  physics.updatePhysics(event);
}

function attachFlowHealthBridge(bus) {
  bus.on("EVENT", (e) => {
    pushFlowGraphHealth(e);
  });
}
