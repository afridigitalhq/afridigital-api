const nodes = new Map();

function registerNode(id, meta = {}) {
  nodes.set(id, {
    id,
    status: "alive",
    meta,
    lastSeen: Date.now()
  });

  console.log("🧩 NODE REGISTERED:", id);
}

function listNodes() {
  return Array.from(nodes.values());
}

function heartbeat(id) {
  if (nodes.has(id)) {
    nodes.get(id).lastSeen = Date.now();
  }
}

module.exports = { registerNode, listNodes, heartbeat };
