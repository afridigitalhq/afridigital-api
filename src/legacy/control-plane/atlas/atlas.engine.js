const state = require("./atlas.state");
const bus = require("../../runtime/event.bus");

/**
 * SAFE GRAPH INGESTION
 * (read-only learning layer)
 */
function ingest(event) {
  const { type, traceId = "sys", payload = {} } = event;

  const from = payload.from || "system";
  const to = payload.to || type;

  // NODE UPDATE
  state.nodes[from] = state.nodes[from] || { weight: 0, errors: 0 };
  state.nodes[to] = state.nodes[to] || { weight: 0, errors: 0 };

  state.nodes[from].weight += 1;
  state.nodes[to].weight += 2;

  if (type.includes("ERROR")) {
    state.nodes[to].errors += 1;
  }

  // EDGE UPDATE
  const key = `${from}->${to}`;
  state.edges[key] = state.edges[key] || {
    from,
    to,
    weight: 0,
    lastSeen: Date.now()
  };

  state.edges[key].weight += 1;
  state.edges[key].lastSeen = Date.now();

  state.lastUpdated = Date.now();

  // STREAM TO UI
  bus.emit("atlas.update", {
    nodes: state.nodes,
    edges: state.edges
  });
}

/**
 * DECAY ENGINE (soft forgetting)
 */
function decay() {
  for (const k in state.edges) {
    state.edges[k].weight *= 0.98;
  }

  for (const k in state.nodes) {
    state.nodes[k].weight *= 0.99;
  }
}

setInterval(decay, 10000);

module.exports = { ingest, state };
