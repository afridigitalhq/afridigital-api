const { EconomicMesh } = require("./agent.mesh.economy.v5.cjs");

const SupportAgent = require("./agents/support.agent.v5.cjs");
const SalesAgent = require("./agents/sales.agent.v5.cjs");

function register(mesh) {
  mesh.registerAgent("SupportAgent", SupportAgent);
  mesh.registerAgent("SalesAgent", SalesAgent);
}

async function runSwarmV5(redis, message) {

  const mesh = new EconomicMesh(redis);
  register(mesh);

  const result = await mesh.runCycle(message);

  return {
    decision: result.decision,
    weights: result.weightedVotes
  };
}

module.exports = { runSwarmV5 };
