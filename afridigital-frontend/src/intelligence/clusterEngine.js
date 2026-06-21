export function clusterNodes(nodes) {
  const map = {};

  for (const n of nodes) {
    const key = n.service || n.type || "unknown";

    if (!map[key]) {
      map[key] = { id: key, nodes: [], heat: 0 };
    }

    map[key].nodes.push(n);
    map[key].heat += (n.physics?.heat || 0);
  }

  return Object.values(map);
}
