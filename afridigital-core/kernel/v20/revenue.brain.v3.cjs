function computeRevenueIntent(message, memory = {}) {
  const t = (message.text || "").toLowerCase();

  let score = 0;

  // intent signals
  if (t.includes("price")) score += 0.4;
  if (t.includes("buy") || t.includes("upgrade")) score += 0.5;
  if (t.includes("plan")) score += 0.3;

  // behavioral signals
  if ((memory.messages || 0) > 5) score += 0.1;
  if ((memory.trust || 0) > 3) score += 0.2;

  // risk penalty
  if ((memory.risk || 0) > 3) score -= 0.4;

  return Math.max(0, Math.min(1, score));
}

function classifyValue(score) {
  if (score > 0.75) return "HIGH_LTV";
  if (score > 0.45) return "MID_LTV";
  return "LOW_LTV";
}

function computeStrategy(valueClass) {
  switch (valueClass) {
    case "HIGH_LTV":
      return {
        mode: "AGGRESSIVE_SELL",
        priority: "IMMEDIATE_RESPONSE",
        discount: 0.2
      };

    case "MID_LTV":
      return {
        mode: "NURTURE_SELL",
        priority: "NORMAL",
        discount: 0.1
      };

    default:
      return {
        mode: "EDUCATE_ONLY",
        priority: "LOW",
        discount: 0
      };
  }
}

module.exports = {
  computeRevenueIntent,
  classifyValue,
  computeStrategy
};
