const { assertApiVersion } = require("../core/runtime/safety/api.guard");
const fs = require('fs');
const fraud = require('./afrios.fraud');

const DB_PATH = './storage/os/state.db.json';

function load() {
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function save(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getWallet(userId) {
  const db = load();

  if (!db.wallets[userId]) {
    db.wallets[userId] = {
      balance: 0,
      pending: 0,
      currency: "AFR",
      history: []
    };
  }

  save(db);
  return db.wallets[userId];
}

// 💰 CREDIT (WITH FRAUD CHECK)
function credit(userId, amount, reason) {

  const check = fraud.validateAction(userId, reason);

  if (!check.allowed) {
    console.log("🚨 BLOCKED FRAUD:", userId);
    return { blocked: true };
  }

  const db = load();
  const wallet = getWallet(userId);

  wallet.balance += amount;

  wallet.history.push({
    type: "CREDIT",
    amount,
    reason,
    time: new Date().toISOString()
  });

  db.wallets[userId] = wallet;

  save(db);

  return wallet;
}

module.exports = {
  getWallet,
  credit
};
