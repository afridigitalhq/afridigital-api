const { analyzeMarket } = require("./analyzer");
const { detectGaps } = require("./gap.engine");
const { generateOpportunityTemplates } = require("./template.engine");
const bus = require('../../eventbus');

function runEconomyIntelligence(data) {

  const analysis = analyzeMarket(data);

  const insights = detectGaps(analysis);

  const templates = generateOpportunityTemplates(analysis);

  const payload = {
    analysis,
    insights,
    templates,
    timestamp: Date.now()
  };

  bus.emit("ECONOMY_INTELLIGENCE_UPDATE", payload);

  return payload;
}

module.exports = { runEconomyIntelligence };
