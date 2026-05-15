const { getHistory } = require("../../event/bus");

function simulateEvolution(changePlan) {

  const snapshot = {
    time: Date.now(),
    eventLoad: getHistory().length,
    changeHash: JSON.stringify(changePlan).length % 9973
  };

  let riskScore = 0;

  if (!changePlan || typeof changePlan !== "object") riskScore = 1;
  else {
    if (changePlan.modifiesKernel) riskScore += 0.5;
    if (changePlan.modifiesLedger) riskScore += 0.5;
    if (changePlan.touchSecurity) riskScore += 0.7;
    if (changePlan.unvalidated) riskScore += 0.4;
  }

  riskScore = Math.min(riskScore, 1);

  let stability = 1;
  if (changePlan?.isIncremental) stability += 0.2;
  if (changePlan?.hasRollbackSupport) stability += 0.3;
  if (changePlan?.breaksBackwardCompatibility) stability -= 0.6;

  stability = Math.max(0, Math.min(stability, 1));

  let decision = "REJECT";

  if (riskScore >= 0.8) decision = "REJECT";
  else if (stability >= 0.6 && riskScore < 0.5) decision = "APPROVE";
  else decision = "REVIEW";

  return {
    snapshot,
    riskScore,
    stability,
    decision
  };
}

module.exports = { simulateEvolution };
