const { getTool } = require('./registry');

async function callTool(name, input) {
  const tool = getTool(name);
  if (!tool) return { ok: false, error: "tool_not_found" };
  return await tool(input);
}

module.exports = { callTool };
