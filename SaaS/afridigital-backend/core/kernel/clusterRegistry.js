const nodes = new Map();

function register(nodeId, meta = {}) {
  nodes.set(nodeId, {
    id: nodeId,
    meta,
    status: "online",
    load: 0,
    lastSeen: Date.now()
  });

  console.log("🌐 NODE REGISTERED:", nodeId);
}

function heartbeat(nodeId) {
  if (nodes.has(nodeId)) {
    nodes.get(nodeId).lastSeen = Date.now();
  }
}

function list() {
  return [...nodes.values()];
}

module.exports = { register, heartbeat, list };
