const { updateBehavior } = require("../engagement/behavior.engine.cjs");
const { shouldShowAd } = require("../smart-timing/timing.engine.cjs");
const { getMemory } = require("../memory-loop/memory.engine.cjs");

function processAI(userId, input) {

  const profile = updateBehavior(userId, {
    type: input.type,
    clicked: input.clicked
  });

  const memory = getMemory(userId);

  let response = {
    message: "AI response generated",
    personalization: memory
  };

  // SMART AD DECISION
  if (shouldShowAd(profile)) {
    response.ad = {
      title: "Earn from WhatsApp jobs today",
      cta: "View Opportunity"
    };
  }

  return response;
}

module.exports = { processAI };
