const { runBrain } = require('../ai/brain');
const { getContext } = require('../memory/store');
const { runGraph } = require('../graph/executor');
const {
  createGraph,
  createExecution
} = require('../graph/store');

const { coordinate } = require('../agents/coordinator');

/**
 * CONTROL PLANE v2 (MULTI-AGENT ENABLED)
 */

async function dispatch(payload) {

  const userId = payload.from || 'anonymous';

  const context = getContext(userId);

  console.log("🧠 [DISPATCH v2] incoming:", payload.text);

  /**
   * 1. MULTI-AGENT COORDINATION LAYER
   */
  const agentResult = await coordinate(payload, context);

  /**
   * 2. GRAPH MODE DETECTION (unchanged)
   */
  const brainResult = agentResult.output;

  if (brainResult?.graph) {

    const graph = brainResult.graph;

    createGraph(graph.graphId, graph);

    const execId = `${graph.graphId}-${Date.now()}`;

    createExecution(execId, graph.graphId, {
      startedAt: Date.now(),
      userId
    });

    const graphResult = await runGraph(execId, userId);

    return {
      mode: "graph",
      agent: agentResult.agent,
      result: graphResult
    };
  }

  /**
   * 3. NORMAL RESPONSE
   */
  return {
    mode: "agent",
    agent: agentResult.agent,
    result: brainResult
  };
}

module.exports = {
  dispatch
};
