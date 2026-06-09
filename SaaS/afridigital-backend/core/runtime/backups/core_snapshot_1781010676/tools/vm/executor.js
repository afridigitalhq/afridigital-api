const { getTool } = require("../registry");
const { validate } = require("./validator");

/**
 * ⚙️ FUNCTION CALLING VM
 * safe execution layer for tools
 */
async function runTool(toolName, input, context = {}) {

  const tool = getTool(toolName);

  if (!tool) {
    throw new Error(`TOOL_NOT_FOUND: ${toolName}`);
  }

  // 🛡️ validate input
  const safeInput = validate(tool.schema, input);

  console.log(`🧰 EXEC TOOL: ${toolName}`, safeInput);

  // ⚙️ execute tool
  const result = await tool.fn(safeInput, context);

  return result;
}

module.exports = { runTool };
