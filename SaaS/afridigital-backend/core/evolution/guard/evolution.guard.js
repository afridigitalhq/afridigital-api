function evolutionGuard(simResult, plan) {

  if (!simResult) return "BLOCK";

  if (simResult.riskScore >= 0.8) return "BLOCK";

  if (plan?.touchSecurity) return "BLOCK";

  if (plan?.modifiesLedger && !plan?.hasAuditTrail) {
    return "BLOCK";
  }

  if (simResult.decision === "REVIEW") {
    return "HUMAN_APPROVAL_REQUIRED";
  }

  return "ALLOW";
}

module.exports = { evolutionGuard };
