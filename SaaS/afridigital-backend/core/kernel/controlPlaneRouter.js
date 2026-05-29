const brain = require("../ai/brain");
const orchestrator = require("../os/orchestratorOS");

/**
 * 🧠 CONTROL PLANE ROUTER (v1)
 * decides execution path
 */
async function routeRequest({ user, text, stream }) {

  const isComplex = (text || "").length > 40 || text?.includes("agent") || text?.includes("tool");

  // SIMPLE PATH → brain
  if (!isComplex) {
    return await brain.runBrain({ user, text });
  }

  // COMPLEX PATH → orchestrator
  return await orchestrator.run({
    user,
    text,
    stream: stream || false
  });
}

module.exports = { routeRequest };
