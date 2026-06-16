const { buildGraphFromLLM } = require('../graph/builder');

function boot(entry = {}) {
  console.log("🧠 SINGLE ENTRY BOOT ACTIVE");

  const graph = buildGraphFromLLM(entry);

  console.log("🧩 GRAPH READY:", {
    nodes: graph?.nodes?.length || 0,
    edges: graph?.edges?.length || 0,
    status: graph?.status || "UNKNOWN"
  });

  return graph;
}

module.exports = boot;
