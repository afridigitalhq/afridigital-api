const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🧠 AfriOS Trust Engine v2.4
 */

const fs = require('fs');

const LEDGER_DB = './storage/ledger/ledger.database.json';

// 📦 LOAD
function load() {
  try {
    return JSON.parse(fs.readFileSync(LEDGER_DB));
  } catch {
    return [];
  }
}

// 📊 CALCULATE TRUST SCORE
function getTrustScore(user) {

  const tx = load().filter(t => t.user === user);

  let score = 50; // base neutral score

  for (const t of tx) {

    // ✅ positive behavior
    if (t.type === "EARN") score += 2;
    if (t.type === "ESCROW_RELEASE") score += 3;
    if (t.type === "AUTO_PAY") score += 2;

    // ⚠️ negative behavior
    if (t.type === "DISPUTE") score -= 5;
    if (t.type === "WITHDRAW" && t.amount > 1000) score -= 1;
  }

  return Math.max(0, Math.min(100, score));
}

// 🚨 FRAUD SCORE ENGINE
function getFraudScore(user) {

  const tx = load().filter(t => t.user === user);

  let risk = 0;

  for (const t of tx) {

    if (t.type === "DISPUTE") risk += 15;
    if (t.type === "CHARGEBACK") risk += 25;
    if (t.type === "FAILED_WITHDRAW") risk += 10;
  }

  return Math.min(100, risk);
}

// 🧾 PROFILE SUMMARY
function getUserProfile(user) {

  return {
    user,
    trustScore: getTrustScore(user),
    fraudScore: getFraudScore(user),
    status:
      getFraudScore(user) > 70
        ? "HIGH RISK"
        : "ACTIVE"
  };
}

module.exports = {
  getTrustScore,
  getFraudScore,
  getUserProfile
};
const fraudEngine = require("./core/fraud.engine");
