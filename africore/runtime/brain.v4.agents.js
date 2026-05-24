const reward = require("./brain.v4.reward");

const agents = {
  fraud: { weight: 1.0 },
  sales: { weight: 1.0 },
  support: { weight: 1.0 }
};

async function adjustWeights(user) {
  const score = await reward.getScore(user);

  if (score > 20) {
    agents.sales.weight += 0.2;
  }

  if (score < 5) {
    agents.fraud.weight += 0.3;
  }

  return agents;
}

function selectAgent() {
  const sorted = Object.entries(agents)
    .sort((a, b) => b[1].weight - a[1].weight);

  return sorted[0][0];
}

module.exports = { agents, adjustWeights, selectAgent };
