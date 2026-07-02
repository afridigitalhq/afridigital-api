const { traceEvent } = require("./aiBrainBus");

function instrumentAI(traceId, input) {
  traceEvent("AI_REQUEST", "received", traceId, {
    input
  });

  return {
    start: () => {
      traceEvent("AI_REQUEST", "processing", traceId);
    },

    complete: (output) => {
      traceEvent("RESPONSE", "completed", traceId, {
        output
      });
    }
  };
}

module.exports = { instrumentAI };
