function scoreRisk(event) {
  let score = 0;

  if (event.type === "DEPLOY_REQUEST") score += 20;
  if (event.containsSecrets) score += 50;
  if (event.isProduction) score += 30;

  return {
    score,
    level: score > 60 ? "HIGH" : score > 30 ? "MEDIUM" : "LOW",
    recommendation: score > 60 ? "REQUIRE_HUMAN_REVIEW" : "OK"
  };
}

module.exports = { scoreRisk };
