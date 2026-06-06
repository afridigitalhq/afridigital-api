const { getAllTraces } = require("../replay-engine/trace.store");

/**
 * 🧠 Predict next AI/system behavior based on past patterns
 */
function predictNextState() {

  const traces = getAllTraces();

  if (!traces.length) {
    return {
      prediction: "NO_DATA",
      confidence: 0
    };
  }

  const last = traces.slice(-20);

  // Simple heuristic model (can later be replaced with ML)
  const intentFrequency = {};

  last.forEach(t => {
    intentFrequency[t.intent] =
      (intentFrequency[t.intent] || 0) + 1;
  });

  const topIntent = Object.entries(intentFrequency)
    .sort((a,b) => b[1] - a[1])[0];

  return {
    prediction: {
      nextLikelyIntent: topIntent?.[0] || "UNKNOWN",
      intensity: topIntent?.[1] || 0
    },
    confidence: Math.min(last.length / 20, 1),
    sampleSize: last.length
  };
}

/**
 * 🧠 Simulate economy impact based on predicted action
 */
function simulateEconomyImpact(prediction) {

  const impact = {
    wallet: 0,
    jobs: 0,
    services: 0,
    engagement: 0
  };

  switch (prediction?.nextLikelyIntent) {

    case "jobs":
      impact.jobs += 1;
      impact.engagement += 0.2;
      break;

    case "earn":
      impact.wallet += 1;
      impact.engagement += 0.3;
      break;

    case "boost":
      impact.services += 1;
      impact.engagement += 0.4;
      break;

    default:
      impact.engagement += 0.1;
  }

  return impact;
}

module.exports = {
  predictNextState,
  simulateEconomyImpact
};
