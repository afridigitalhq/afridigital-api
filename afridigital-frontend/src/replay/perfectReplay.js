export function buildSnapshot(events, targetIndex) {
  const nodes = {};
  const edges = [];

  for (let i = 0; i <= targetIndex; i++) {
    const e = events[i];
    if (!e) continue;

    switch (e.type) {
      case "NODE_UPDATE":
        nodes[e.node] = e;
        break;

      case "EDGE_UPDATE":
        edges.push(e);
        break;

      case "NODE_DELETE":
        delete nodes[e.node];
        break;
    }
  }

  return { nodes, edges };
}
