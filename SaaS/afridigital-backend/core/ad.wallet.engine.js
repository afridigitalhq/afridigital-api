const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 💼 AfriOS Ad Wallet Engine v2.9
 */

const wallets = {};

function fundWallet(user, amount) {

  if (!wallets[user]) {
    wallets[user] = { balance: 0 };
  }

  wallets[user].balance += amount;

  return wallets[user];
}

function spend(user, amount) {

  if (!wallets[user] || wallets[user].balance < amount) {
    return "INSUFFICIENT_FUNDS";
  }

  wallets[user].balance -= amount;

  return wallets[user];
}

function getBalance(user) {
  return wallets[user] || { balance: 0 };
}

module.exports = {
  fundWallet,
  spend,
  getBalance
};
