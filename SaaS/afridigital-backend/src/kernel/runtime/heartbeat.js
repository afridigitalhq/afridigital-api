function startHeartbeat(graph, interval = 5000) {
  setInterval(() => {
    for (const node of graph.nodes.values()) {
      try {
        if (node.instance && node.instance.health) {
          node.status = node.instance.health();
        }
      } catch (e) {
        node.status = "degraded";
        node.error = e.message;
      }
    }
  }, interval);
}

module.exports = { startHeartbeat };
