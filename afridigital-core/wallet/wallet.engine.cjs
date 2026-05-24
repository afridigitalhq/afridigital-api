const bus = require("../afridigital-core/kernel/events/event.bus.cjs");

let balance = {};

function credit(user, amount) {
  balance[user] = (balance[user] || 0) + amount;
  bus.emitEvent("WALLET_TOPUP", { user, amount });
}

function debit(user, amount) {
  balance[user] = (balance[user] || 0) - amount;
  bus.emitEvent("WALLET_WITHDRAW", { user, amount });
}

function getBalance(user) {
  return balance[user] || 0;
}

module.exports = { credit, debit, getBalance };
