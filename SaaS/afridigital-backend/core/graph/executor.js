const {
  getGraph,
  getExecution,
  updateExecution
} = require('./store');

const { safeExecute } = require('../tools/safeExecutor');

async function runNode(execId, nodeId, userId) {
  const exec = getExecution(execId);
  const graph = getGraph(exec.graphId);

  const node = graph.nodes[nodeId];
  if (!node) return { ok: false, error: "Missing node" };

  let result = null;

  if (node.type === "tool") {
    result = await safeExecute(
      userId,
      node.tool,
      node.args || {}
    );
  }

  updateExecution(execId, {
    pointer: nodeId,
    history: [
      ...exec.history,
      { nodeId, result }
    ]
  });

  return result;
}

async function runGraph(execId, userId) {
  const exec = getExecution(execId);
  const graph = getGraph(exec.graphId);

  let current = exec.pointer || "start";

  if (exec.status === "completed") {
    return exec;
  }

  while (current && graph.nodes[current]) {
    const node = graph.nodes[current];

    const result = await runNode(execId, current, userId);

    if (node.branch) {
      current = result?.ok
        ? node.branch.success
        : node.branch.fail;
    } else {
      current = node.next;
    }

    updateExecution(execId, {
      pointer: current,
      status: "running"
    });
  }

  updateExecution(execId, {
    status: "completed",
    pointer: null
  });

  return getExecution(execId);
}

module.exports = {
  runGraph
};
