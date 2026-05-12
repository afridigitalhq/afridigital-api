const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require('fs');
const wallet = require('./afrios.wallet');

const DB_PATH = './storage/os/state.db.json';

function load() {
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function save(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// 💸 REQUEST WITHDRAWAL
function requestWithdrawal(userId, amount, method = "wallet") {

  const db = load();

  const userWallet = wallet.getWallet(userId);

  if (userWallet.balance < amount) {
    return { error: "INSUFFICIENT_FUNDS" };
  }

  // move to pending
  userWallet.balance -= amount;
  userWallet.pending += amount;

  const request = {
    id: Date.now().toString(),
    userId,
    amount,
    method,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };

  db.withdrawals.push(request);

  save(db);

  return request;
}

// 🧾 ADMIN APPROVE
function approveWithdrawal(id) {
  const db = load();

  const req = db.withdrawals.find(w => w.id === id);

  if (!req) return null;

  req.status = "APPROVED";

  const userWallet = wallet.getWallet(req.userId);
  userWallet.pending -= req.amount;

  save(db);

  return req;
}

// ❌ ADMIN REJECT
function rejectWithdrawal(id) {
  const db = load();

  const req = db.withdrawals.find(w => w.id === id);

  if (!req) return null;

  req.status = "REJECTED";

  const userWallet = wallet.getWallet(req.userId);

  userWallet.pending -= req.amount;
  userWallet.balance += req.amount;

  save(db);

  return req;
}

module.exports = {
  requestWithdrawal,
  approveWithdrawal,
  rejectWithdrawal
};
