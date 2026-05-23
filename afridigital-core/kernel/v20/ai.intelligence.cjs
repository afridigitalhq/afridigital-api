function classifyIntent(text = "") {
  const t = text.toLowerCase();

  if (t.includes("price") || t.includes("buy") || t.includes("order")) return "SALES";
  if (t.includes("help") || t.includes("issue") || t.includes("error")) return "SUPPORT";
  if (t.includes("pay") || t.includes("transfer") || t.includes("otp")) return "TRANSACTION";
  if (t.includes("sex") || t.includes("hack") || t.includes("free money")) return "SPAM";

  return "CASUAL";
}

function riskScore(text = "") {
  let score = 0;

  const t = text.toLowerCase();

  if (t.includes("free money")) score += 0.6;
  if (t.includes("hack")) score += 0.5;
  if (t.includes("click")) score += 0.3;
  if (t.length > 300) score += 0.2;

  return Math.min(score, 1);
}

function userScore(message) {
  let score = 0.5;

  if (message.user?.startsWith("234")) score += 0.1;
  if (message.historyCount > 5) score += 0.2;
  if (message.recentActivity === "active") score += 0.2;

  return Math.min(score, 1);
}

function enrich(message) {
  const intent = classifyIntent(message.text);
  const risk = riskScore(message.text);
  const userScoreVal = userScore(message);

  return {
    ...message,
    ai: {
      intent,
      risk,
      userScore: userScoreVal,
      priorityBoost: intent === "SUPPORT" || intent === "TRANSACTION"
    }
  };
}

module.exports = { enrich };
