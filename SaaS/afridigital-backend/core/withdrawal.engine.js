const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 💸 AfriOS Withdrawal Engine
 */

const fs = require('fs');
const path = require('path');

const { getUserLedger } = require('./ledger.engine');
const { calculateFraudScore } = require('./fraud.engine');
const { withdrawalCooldown } = require('./cooldown.engine');

const DB = path.join(
  __dirname,
  '../storage/withdrawals/withdrawal.queue.json'
);

function loadQueue() {
  try {
    return JSON.parse(fs.readFileSync(DB));
  } catch {
    return [];
  }
}

function saveQueue(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

function requestWithdrawal(user, amount) {

  const ledger = getUserLedger(user);

  // 🚫 insufficient balance
  if (ledger.availableBalance < amount) {
    return {
      success: false,
      message: "Insufficient balance"
    };
  }

  // 🚨 fraud analysis
  const fraud = calculateFraudScore(ledger);

  // ⏳ cooldown
  const cooldown = withdrawalCooldown(24);

  const queue = loadQueue();

  const request = {
    id: `wd_${Date.now()}`,
    user,
    amount,
    status: fraud.risk === "HIGH"
      ? "BLOCKED"
      : "PENDING",

    fraud,
    cooldown,

    createdAt: new Date().toISOString()
  };

  queue.push(request);

  saveQueue(queue);

  return request;
}

module.exports = {
  requestWithdrawal
};
