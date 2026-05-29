const { callTool } = require('../tools/call');

async function agentRouter(message) {

  // SIMPLE MULTI-AGENT ROUTING LOGIC
  if (message.includes("echo")) {
    return {
      agent: "echo-agent",
      tool: "echo",
      input: message
    };
  }

  return {
    agent: "default-agent",
    reply: "Processed: " + message
  };
}

async function runAgent(message) {
  const plan = await agentRouter(message);

  if (plan.tool) {
    const result = await callTool(plan.tool, plan.input);
    return { plan, result };
  }

  return { plan };
}

module.exports = { runAgent };
