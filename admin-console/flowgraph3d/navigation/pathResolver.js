export function resolvePath(graph, startId) {
  const edges = Object.values(graph.edges || {});
  const nodes = graph.nodes || {};

  const visited = new Set();
  const path = [];

  function dfs(nodeId) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    path.push(nodeId);

    edges
      .filter(e => e.from === nodeId)
      .forEach(e => dfs(e.to));
  }

  dfs(startId);

  return path;
}
