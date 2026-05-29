const { planner } = require("../agents/planner");
const { executor } = require("../agents/executor");
const { critic } = require("../agents/critic");

const { streamWithTyping } = require("./enhancedStreamer");

/**
 * MULTI-AGENT COORDINATOR
 */
async function runMultiAgent(sessionId, input) {

  // 🧠 1. PLAN
  const plan = await planner(input);

  // ⚙️ 2. EXECUTE
  const draft = await executor(plan, input);

  // 🔍 3. CRITIC
  const final = await critic(draft, plan);

  // ⚡ 4. STREAM FINAL OUTPUT
  return await streamWithTyping(sessionId, final);
}

module.exports = { runMultiAgent };
