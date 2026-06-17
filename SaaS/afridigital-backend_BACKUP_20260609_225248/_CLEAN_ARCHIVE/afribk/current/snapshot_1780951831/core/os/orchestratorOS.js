const { planner } = require("../agents/planner");
const { executor } = require("../agents/executor");
const { critic } = require("../agents/critic");
const { toolAgent } = require("../agents/toolAgent");

const { executeToolCall } = require("./toolBridge");
const { streamWithTyping } = require("../stream/enhancedStreamer");

/**
 * 🧠 FULL ORCHESTRATION OS v2
 */
async function runOrchestrator({ user, text }) {

  // 🧭 PLAN
  const plan = await planner(text);

  // 🧰 TOOL DECISION
  const toolCall = await toolAgent(text);

  let toolResult = null;

  // ⚙️ TOOL EXECUTION LAYER
  if (toolCall.tool) {
    toolResult = await executeToolCall(toolCall, { user });
  }

  // ⚙️ EXECUTE
  let draft = await executor(plan, text);

  // 🔍 CRITIC (tool-aware)
  if (toolResult) {
    draft += `\n\n[Tool Result]\n${JSON.stringify(toolResult.result)}`;
  }

  const final = await critic(draft, plan);

  // 📡 STREAM OUTPUT
  const streamed = await streamWithTyping(user, final);

  return {
    reply: streamed,
    plan,
    toolCall,
    toolResult
  };
}

module.exports = { runOrchestrator };
