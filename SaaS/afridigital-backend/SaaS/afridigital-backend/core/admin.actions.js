const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * ⚙️ AfriOS Admin Actions v2.1
 */

const fs = require('fs');
const path = require('path');

const WD_DB = path.join(
  __dirname,
  '../storage/withdrawals/withdrawal.queue.json'
);

// 📦 LOAD / SAVE
function load() {
  try {
    return JSON.parse(fs.readFileSync(WD_DB));
  } catch {
    return [];
  }
}

function save(data) {
  fs.writeFileSync(WD_DB, JSON.stringify(data, null, 2));
}

// ✅ APPROVE WITHDRAWAL
function approveWithdrawal(id) {
  const data = load();

  const tx = data.find(w => w.id === id);
  if (!tx) return "NOT FOUND";

  tx.status = "APPROVED";

  save(data);

  return `✅ Withdrawal approved: ${id}`;
}

// ❌ REJECT WITHDRAWAL
function rejectWithdrawal(id) {
  const data = load();

  const tx = data.find(w => w.id === id);
  if (!tx) return "NOT FOUND";

  tx.status = "REJECTED";

  save(data);

  return `❌ Withdrawal rejected: ${id}`;
}

// 🔒 FREEZE USER (simple flag system placeholder)
const frozenUsers = new Set();

function freezeUser(user) {
  frozenUsers.add(user);
  return `🚫 User frozen: ${user}`;
}

function unfreezeUser(user) {
  frozenUsers.delete(user);
  return `✅ User unfrozen: ${user}`;
}

function isFrozen(user) {
  return frozenUsers.has(user);
}

module.exports = {
  approveWithdrawal,
  rejectWithdrawal,
  freezeUser,
  unfreezeUser,
  isFrozen
};
