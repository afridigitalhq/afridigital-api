const normalize = require("../pipeline/normalize");
const intentAI = require("../pipeline/intent.ai");

// FlowGraph engine (REAL)
const { executeFlow } = require("../../flow/engine/runtime");

/**
 * WhatsApp → FlowGraph Controller
 */
async function handleWhatsApp(reqBody = {}) {
  const input = normalize(reqBody);
  const intent = intentAI(input.text);

  // Map intent → FlowGraph flowName
  const flowMap = {
    greeting: "greetingFlow",
    system_query: "systemFlow",
    flow_request: "systemFlow",
    unknown: "systemFlow"
  };

  const flowName = flowMap[intent.primary] || "systemFlow";

  const result = await executeFlow(flowName, {
    input,
    intent
  });

  return {
    ok: true,
    from: input.from,
    intent: intent.primary,
    flow: flowName,
    response: result.result
  };
}

module.exports = { handleWhatsApp };
