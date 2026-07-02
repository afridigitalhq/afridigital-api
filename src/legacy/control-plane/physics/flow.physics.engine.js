const bus = require("../controlBus");

const state = {
  nodes: {},
  edges: {},
};

/**
 * Register node (service)
 */
function registerNode(id, meta = {}) {
  if (!state.nodes[id]) {
    state.nodes[id] = {
      id,
      load: 0,
      errorRate: 0,
      activity: 0,
      energy: 0,
      ...meta
    };
  }
}

/**
 * Register edge (route connection)
 */
function registerEdge(from, to) {
  const key = `${from}->${to}`;

  if (!state.edges[key]) {
    state.edges[key] = {
      from,
      to,
      weight: 0.5,
      latency: 0,
      flow: 0
    };
  }
}

/**
 * Update live metrics (core physics step)
 */
function updatePhysics(event) {
  const { type, payload } = event;

  const from = payload?.from;
  const to = payload?.to;

  if (from) registerNode(from);
  if (to) registerNode(to);

  if (from && to) registerEdge(from, to);

  const edgeKey = `${from}->${to}`;
  const edge = state.edges[edgeKey];
  const nodeA = state.nodes[from];
  const nodeB = state.nodes[to];

  if (!edge || !nodeA || !nodeB) return;

  // =========================
  // PHYSICS MODEL
  // =========================

  // flow increases kinetic energy
  edge.flow += 1;
  nodeA.activity += 1;

  // latency creates resistance
  const latency = payload?.latency || 0;
  edge.latency = (edge.latency + latency) / 2;

  // success increases attraction
  const success = payload?.success !== false;
  if (success) {
    edge.weight = Math.min(1, edge.weight + 0.02);
    nodeA.energy += 1;
    nodeB.energy += 1;
  } else {
    edge.weight = Math.max(0.05, edge.weight - 0.04);
    nodeA.errorRate += 1;
    nodeB.errorRate += 1;
  }

  // node stability calculation
  nodeA.load = Math.min(1, nodeA.activity / 100);
  nodeB.load = Math.min(1, nodeB.activity / 100);

  // emit to UI layer
  bus.emitEvent({
    type: "FLOW_PHYSICS_UPDATE",
    stage: "tick",
    traceId: payload?.traceId || "system",
    payload: {
      nodes: state.nodes,
      edges: state.edges
    }
  });
}

/**
 * Get snapshot for UI rendering
 */
function getGraphState() {
  return state;
}

module.exports = {
  registerNode,
  registerEdge,
  updatePhysics,
  getGraphState
};
