/**
 * 🔍 FlowGraph Node Drilldown System
 * Deep AI reasoning + dependency explorer
 */

const eventbus = require("../../eventbus");

/**
 * 🧠 Store full node traces
 */
const nodeStore = new Map();

/**
 * 📦 Register node with full metadata
 */
function registerNode(node) {

  nodeStore.set(node.id, {
    ...node,
    timestamp: Date.now()
  });
}

/**
 * 🔍 Get full drilldown info
 */
function getNodeDetails(nodeId) {

  const node = nodeStore.get(nodeId);

  if (!node) {
    return { error: "NODE_NOT_FOUND" };
  }

  return {
    node,

    explanation: {
      summary: node.reasoning || "No reasoning available",
      confidence: node.confidence || 0,
      score: node.score || 0
    },

    lineage: {
      inputs: node.inputs || [],
      outputs: node.outputs || []
    },

    impact: {
      type: node.type,
      label: node.label
    }
  };
}

/**
 * 📡 Hook into FlowGraph stream
 */
eventbus.on("FLOWGRAPH_NODE_CREATED", (node) => {
  registerNode(node);
});

module.exports = {
  registerNode,
  getNodeDetails
};
