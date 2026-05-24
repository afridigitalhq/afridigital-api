function revenueScore(message, memory = {}) {
  let score = 0;

  const t = (message.text || "").toLowerCase();

  // buying intent signals
  if (t.includes("price") || t.includes("buy") || t.includes("cost")) score += 0.4;
  if (t.includes("how much") || t.includes("plan")) score += 0.3;

  // trust signals
  if ((memory.trust || 0) > 3) score += 0.2;

  // engagement signals
  if ((memory.messages || 0) > 5) score += 0.1;

  return Math.min(score, 1);
}

function classifyCustomer(score) {
  if (score > 0.7) return "HOT";
  if (score > 0.4) return "WARM";
  return "COLD";
}

module.exports = { revenueScore, classifyCustomer };
