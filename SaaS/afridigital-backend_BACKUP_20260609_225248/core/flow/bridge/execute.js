const { executeFlow } = require("../engine/runtime");

/**
 * Bridge WhatsApp → FlowGraph Engine
 */
async function executeFlowBridge(flowName, context = {}) {
  return await executeFlow(flowName, context);
}

module.exports = { executeFlow: executeFlowBridge };
