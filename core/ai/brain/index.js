/**
 * 🧠 AfriAI Brain Core (FIXED VERSION)
 * Single orchestration entry point for all AI logic
 */

const eventbus = require('../../eventbus');
const { orchestrate } = require("../multi-agent-economy");
const { getRankedInsights } = require("../insight-ranking-engine");

/**
 * 🧠 MAIN AI PROCESSOR
 */
function processAI(event) {

  // STEP 1: Multi-agent analysis
  const agents = orchestrate(event);

  // STEP 2: Insight ranking
  const insights = getRankedInsights();

  // STEP 3: Structured AI output
  const output = {
    event,
    agents,
    insights,
    timestamp: Date.now()
  };

  // STEP 4: Emit to realtime layer
  eventbus.emit("AI_OUTPUT", output);

  return output;
}

/**
 * 🔌 CONNECT BRAIN TO EVENT SYSTEM
 */
eventbus.on("MARKET_EVENT", (event) => {
  processAI(event);
});

module.exports = {
  processAI
};
