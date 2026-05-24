const { AgentMesh } = require("./agent.mesh.v4.cjs");

const SupportAgent = require("./agents/support.agent.v4.cjs");
const SalesAgent = require("./agents/sales.agent.v4.cjs");

const mesh = new AgentMesh();

mesh.registerAgent("SupportAgent", SupportAgent);
mesh.registerAgent("SalesAgent", SalesAgent);

async function runSwarmV4(message) {

  const context = {
    text: message.text,
    user: message.user
  };

  const result = await mesh.runCycle(context);

  return {
    finalDecision: result.decision,
    consensus: result.consensus,
    fullTrace: result.raw
  };
}

module.exports = { runSwarmV4 };
