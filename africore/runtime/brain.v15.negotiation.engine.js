const agents = require("./brain.v15.agents.registry");
const wallet = require("../runtime/brain.agent.wallets");

/**
 * Each agent votes on what action should happen
 */
function negotiate(context) {
  const votes = [];

  for (const [name, config] of Object.entries(agents)) {

    let score = 0;

    if (name === "fraud" && context.text.includes("hack")) score = 0.95;
    if (name === "sales" && context.text.includes("buy")) score = 0.9;
    if (name === "support" && context.text.includes("help")) score = 0.85;
    if (name === "analytics") score = 0.5;

await wallet.credit(name, score);
    votes.push({
      agent: name,
      score: score * config.weight
    });
  }

  votes.sort((a, b) => b.score - a.score);

  return {
    winner: votes[0],
    votes
  };
}

module.exports = { negotiate };
