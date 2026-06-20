const { emitAdminEvent } = require("../../realtime/admin-stream");

/**
 * In-memory node activity map
 */
const nodeState = new Map();

const DECAY_RATE = 0.92;

/**
 * Register activity for a node (service / route / brain module)
 */
function registerNodeActivity(nodeId, weight = 1) {
  const current = nodeState.get(nodeId) || {
    activity: 0,
    lastUpdate: Date.now()
  };

  current.activity = Math.min(1, current.activity + weight * 0.1);
  current.lastUpdate = Date.now();

  nodeState.set(nodeId, current);
}

/**
 * Natural decay over time (dead routes fade)
 */
function decayNodes() {
  for (const [id, state] of nodeState.entries()) {
    state.activity *= DECAY_RATE;

    if (state.activity < 0.02) {
      nodeState.delete(id);
    } else {
      nodeState.set(id, state);
    }
  }
}

/**
 * Convert state → Flow Graph rendering instructions
 */
function computeGraphState() {
  const nodes = [];

  for (const [id, state] of nodeState.entries()) {
    nodes.push({
      id,
      intensity: state.activity,
      size: 10 + state.activity * 40,
      thickness: 1 + state.activity * 6,
      glow: state.activity > 0.7 ? "red"
          : state.activity > 0.4 ? "amber"
          : "cyan",
      pulseSpeed: 600 - state.activity * 500
    });
  }

  return {
    nodes,
    globalLoad: nodes.reduce((a, n) => a + n.intensity, 0)
  };
}

/**
 * STREAM TO ADMIN FLOW GRAPH
 */
function startNeuralCortexFlow(interval = 2000) {
  console.log("🧠 NEURAL CORTEX FLOW GRAPH ACTIVE");

  setInterval(() => {
    decayNodes();

    const graph = computeGraphState();

    emitAdminEvent("FLOW_GRAPH_NEURAL", {
      type: "CORTEX_UPDATE",
      stage: "live",
      traceId: "neural-cortex",
      payload: graph
    });
  }, interval);
}

module.exports = {
  registerNodeActivity,
  startNeuralCortexFlow
};
