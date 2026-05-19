const bus = require("../v15/bus.cjs");
const { emit } = require("../events/spine.cjs");

function credit(user, amount) {
  bus.economy.ledger.push({ type: "credit", user, amount });
  emit("WALLET_CREDIT", { user, amount });
}

function debit(user, amount) {
  bus.economy.ledger.push({ type: "debit", user, amount });
  emit("WALLET_DEBIT", { user, amount });
}

module.exports = { credit, debit };
