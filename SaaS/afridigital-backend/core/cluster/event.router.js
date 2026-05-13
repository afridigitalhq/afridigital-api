const registry = require("./node.registry");

function hashKey(key, nodes) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % nodes.length;
  }
  return hash;
}

function routeToNodes(event, replicationFactor = 2) {
  const nodes = registry.getHealthyNodes();

  if (nodes.length === 0) {
    throw new Error("No cluster nodes available");
  }

  const primaryIndex = hashKey(
    event.payload?.userId || event.payload?.user || "global",
    nodes
  );

  const selected = [];

  for (let i = 0; i < replicationFactor; i++) {
    const node = nodes[(primaryIndex + i) % nodes.length];
    if (node) selected.push(node);
  }

  return selected;
}

module.exports = { routeToNodes };
