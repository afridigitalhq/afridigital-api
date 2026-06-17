function createClusterRouter(registry) {

  function selectNode() {
    const nodes = registry.list();

    if (nodes.length === 0) {
      console.log("❌ NO CLUSTER NODES AVAILABLE");
      return null;
    }

    // simplest strategy: least load
    return nodes.sort((a, b) => a.load - b.load)[0];
  }

  function route(job, executor) {
    const node = selectNode();

    if (!node) return null;

    console.log("⚡ ROUTING JOB:", job.traceId, "→", node.id);

    node.load++;

    return executor(job, node);
  }

  return { route };
}

module.exports = { createClusterRouter };
