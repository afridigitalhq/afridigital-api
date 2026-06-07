/*__FLOW_FROZEN__*/
const graph = require("./graph");

/**
 * REAL FLOWGRAPH EXECUTION ENGINE
 */
async function executeFlow(flowName, context = {}) {
  const flow = graph[flowName];

  if (!flow) {
    return { ok: false, error: "Flow not found" };
  }

  let currentNode = flow.start;
  let lastResult = null;

  while (currentNode) {
    const node = flow.nodes[currentNode];

    if (!node) {
      return { ok: false, error: `Node not found: ${currentNode}` };
    }

    lastResult = await node.run(context);

    currentNode = lastResult.next;
  }

  return {
    ok: true,
    flow: flowName,
    result: lastResult.message
  };
}

module.exports = { executeFlow };
