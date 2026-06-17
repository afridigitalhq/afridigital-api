function createClusterExecutor(registry, memory) {

  async function execute(job, node) {

    // simulate execution (later: HTTP / Redis / RPC)
    console.log("🧠 EXEC ON NODE:", node.id, job.text);

    memory.write(job.traceId, {
      status: "completed",
      node: node.id,
      result: "processed by v9 cluster brain"
    });

    return {
      ok: true,
      node: node.id
    };
  }

  return { execute };
}

module.exports = { createClusterExecutor };
