const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require('fs');

const DB_PATH = './storage/os/state.db.json';

function load() {
  return JSON.parse(fs.readFileSync(DB_PATH));
}

// 🚨 BASIC FRAUD CHECK
function isSuspicious(userId, eventType) {
  const db = load();

  const recent = db.events.filter(e =>
    e.data?.userId === userId &&
    e.event === eventType
  ).slice(-5);

  // rule 1: too many rapid actions
  if (recent.length >= 5) {
    return true;
  }

  return false;
}

// 🚫 BLOCK EARNING IF FRAUD DETECTED
function validateAction(userId, eventType) {
  if (isSuspicious(userId, eventType)) {
    return {
      allowed: false,
      reason: "FRAUD_SUSPECTED"
    };
  }

  return { allowed: true };
}

module.exports = {
  validateAction
};
