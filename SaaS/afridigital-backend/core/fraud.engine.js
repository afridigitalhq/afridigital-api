const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🛡️ AfriOS Fraud Engine v2.5
 */

const fs = require('fs');

const JOB_DB = './storage/jobs.json';
const LEDGER_DB = './storage/ledger/ledger.database.json';

// 📦 LOAD
function load(file) {
  try {
    return JSON.parse(fs.readFileSync(file));
  } catch {
    return [];
  }
}

// 🚨 BASIC FRAUD SIGNALS
function analyzeUser(user) {

  const jobs = load(JOB_DB).filter(j => j.worker === user);
  const ledger = load(LEDGER_DB).filter(t => t.user === user);

  let riskScore = 0;

  // ❌ too many disputes
  const disputes = jobs.filter(j => j.disputed).length;
  if (disputes > 3) riskScore += 30;

  // ❌ too many fast withdrawals
  const withdrawals = ledger.filter(l => l.type === "WITHDRAW");
  if (withdrawals.length > 10) riskScore += 20;

  // ❌ empty proof submissions
  const badProofs = jobs.filter(
    j => j.proof && (!j.proof.images || j.proof.images.length === 0)
  ).length;

  if (badProofs > 2) riskScore += 25;

  return {
    user,
    riskScore: Math.min(100, riskScore),
    status:
      riskScore > 70
        ? "HIGH_RISK"
        : riskScore > 40
        ? "MEDIUM_RISK"
        : "LOW_RISK"
  };
}

// 🚫 AUTO ACTION DECISION ENGINE
function autoAction(userRisk) {

  if (userRisk.riskScore > 70) {
    return "FREEZE_USER";
  }

  if (userRisk.riskScore > 40) {
    return "LIMIT_WITHDRAWALS";
  }

  return "ALLOW";
}

module.exports = {
  analyzeUser,
  autoAction
};
