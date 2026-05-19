const { assertApiVersion } = require("../runtime/safety/api.guard");
const weights = {
  monetization: 0.5,
  engagement: 0.5,
  workflows: 0.5,
  ads: 0.5
};

function updateWeights(metrics) {

  if (metrics.revenue > 100) {
    weights.monetization += 0.1;
  }

  if (metrics.userGrowth > 50) {
    weights.engagement += 0.1;
  }

  if (metrics.systemLoad > 80) {
    weights.workflows -= 0.1;
  }

  return weights;
}

function getWeights() {
  return weights;
}

module.exports = {
  updateWeights,
  getWeights
};
