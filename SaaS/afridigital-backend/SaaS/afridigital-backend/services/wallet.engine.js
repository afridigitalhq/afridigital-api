const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require('fs');

const WALLET_FILE = './storage/wallet/wallet.db.json';

function loadWallet() {
  if (!fs.existsSync(WALLET_FILE)) return {};
  return JSON.parse(fs.readFileSync(WALLET_FILE));
}

function saveWallet(data) {
  fs.writeFileSync(WALLET_FILE, JSON.stringify(data, null, 2));
}

function getBalance(user) {
  const db = loadWallet();
  return db[user]?.balance || 0;
}

function addPoints(user, points, reason = "ad_click") {
  const db = loadWallet();

  if (!db[user]) {
    db[user] = { balance: 0, history: [] };
  }

  db[user].balance += points;
  db[user].history.push({
    type: reason,
    points,
    time: new Date().toISOString()
  });

  saveWallet(db);
  return db[user].balance;
}

module.exports = {
  getBalance,
  addPoints
};
