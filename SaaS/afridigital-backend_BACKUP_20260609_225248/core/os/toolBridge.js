const { runTool } = require("../tools/vm/executor");

/**
 * 🧠 TOOL CALLING BRIDGE (OS LAYER)
 */
async function executeToolCall(call, context) {

  try {

    const { tool, input } = call;

    const result = await runTool(tool, input, context);

    return {
      success: true,
      tool,
      result
    };

  } catch (err) {

    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = { executeToolCall };
