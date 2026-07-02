const market = require("./brain.v18.market.registry");

/**
 * Bots compete for ownership of a lead
 */
async function resolveLeadCompetition(lead) {

  const nodes = await market.listNodes();

  let best = null;
  let bestScore = 0;

  for (const node of nodes) {

    let score = 0.5; // baseline

    if (node.capabilities.includes("sales")) score += 0.3;
    if (node.capabilities.includes("support")) score += 0.2;
    if (node.capabilities.includes("fraud-filter")) score += 0.4;

    if (score > bestScore) {
      best = node;
      bestScore = score;
    }
  }

  return {
    winner: best,
    score: bestScore
  };
}

module.exports = { resolveLeadCompetition };
