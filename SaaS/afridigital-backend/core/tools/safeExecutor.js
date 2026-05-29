const { getTool } = require('./registry');
const { validateToolAccess } = require('./policy');

/**
 * SAFE TOOL EXECUTION LAYER v1
 * All tool execution MUST pass through here
 */

async function safeExecute(userId, toolName, args = {}) {

  // 1. POLICY CHECK
  const policy = validateToolAccess(userId, toolName, args);

  if (!policy.ok) {
    console.log("⛔ TOOL BLOCKED:", toolName, policy.reason);

    return {
      ok: false,
      error: policy.reason
    };
  }

  // 2. TOOL RESOLUTION
  const tool = getTool(toolName);

  if (!tool) {
    return {
      ok: false,
      error: `Tool not found: ${toolName}`
    };
  }

  // 3. EXECUTION
  try {
    console.log("🔧 EXECUTING TOOL:", toolName);

    const result = await tool.execute(args);

    return result;

  } catch (err) {
    console.log("🔥 TOOL ERROR:", toolName, err.message);

    return {
      ok: false,
      error: err.message
    };
  }
}

module.exports = {
  safeExecute
};
