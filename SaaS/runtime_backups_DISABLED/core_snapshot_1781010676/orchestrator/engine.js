const memory = require("../memory/store");
const { runMultiAgent } = require("../stream/agentStream");

/**
 * MAIN ORCHESTRATOR (MULTI-AGENT MODE)
 */
async function runOrchestrator({ user, text }) {

  await memory.pushMessage(user, { text });

  const reply = await runMultiAgent(user, text);

  return {
    reply,
    mode: "multi-agent-stream-v1"
  };
}

module.exports = { runOrchestrator };
