const nodes = new Map();

function register(nodeId, meta = {}) {
  nodes.set(nodeId, {
    id: nodeId,
    meta,
    status: "online",
    lastSeen: Date.now()
  });

  console.log("🌐 NODE ONLINE:", nodeId);
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
