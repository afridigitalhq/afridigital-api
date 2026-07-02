global.__FLOWGRAPH_SAFE_INIT__ = global.__FLOWGRAPH_SAFE_INIT__ || false;
/**
 * 🌐 FlowGraph Live Stream Engine
 * Converts AI brain output → visual graph nodes
 */

const eventbus = require("../../eventbus");

let subscribers = [];

/**
 * 📡 Subscribe UI clients
 */
function subscribe(fn) {
  subscribers.push(fn);
}

/**
 * 📊 Convert AI output → FlowGraph nodes
 */
function buildGraph(data) {

  const nodes = [];

  // AI ROOT NODE
  nodes.push({
    id: "ai_brain",
    label: "🧠 AI Brain",
    type: "core"
  });

  // MARKET EVENT NODE
  nodes.push({
    id: "event",
    label: data.event?.type || "Market Event",
    type: "input"
  });

  // MULTI-AGENT NODES
  Object.entries(data.agents || {}).forEach(([key, value]) => {

    nodes.push({
      id: key,
      label: `🤖 ${key.toUpperCase()}`,
      type: "agent",
      data: value
    });
  });

  // INSIGHT NODE
  nodes.push({
    id: "insights",
    label: "📊 Insights Engine",
    type: "analysis",
    data: data.insights
  });

  return nodes;
}

/**
 * 📤 Broadcast FlowGraph update
 */
function broadcastGraph(data) {

  const graph = buildGraph(data);

  subscribers.forEach(fn => fn({
    type: "FLOWGRAPH_UPDATE",
    graph,
    timestamp: Date.now()
  }));
}

/**
 * 🔌 Connect to AI OUTPUT stream
 */
function initFlowGraphStream() {

  eventbus.on("AI_OUTPUT", (data) => {
    broadcastGraph(data);
  });

  console.log("🌐 FlowGraph Stream Engine ACTIVE");
}

module.exports = {
  subscribe,
  initFlowGraphStream
};
