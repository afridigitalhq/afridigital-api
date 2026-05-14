const fraud = require("../fraud/fraud.engine");
const ledger = require("../ledger/double.entry.ledger");

class SettlementEngine {
  constructor() {
    this.pending = new Map();
  }

  createTransfer({ from, to, amount, currency = "NGN" }) {
    const id = "stl_" + Date.now();

    const instruction = {
      id,
      from,
      to,
      amount,
      currency,
      status: "PENDING",
      createdAt: Date.now()
    };

    this.pending.set(id, instruction);
    return instruction;
  }

  validate(id) {
    const tx = this.pending.get(id);
    if (!tx) return null;

    const risk = fraud.score({
      type: "ledger.debit",
      amount: tx.amount,
      ts: tx.createdAt
    });

    if (risk.flagged) {
      tx.status = "BLOCKED";
      tx.reason = "FRAUD_SUSPECTED";
      return tx;
    }

    tx.status = "RESERVED";
    return tx;
  }

  execute(id) {
    const tx = this.pending.get(id);
    if (!tx || tx.status !== "RESERVED") return tx;

    ledger.debit(tx.from, tx.amount);
    ledger.credit(tx.to, tx.amount);

    tx.status = "SETTLED";
    tx.settledAt = Date.now();

    return tx;
  }

  finalize(id) {
    const tx = this.pending.get(id);
    if (!tx || tx.status !== "SETTLED") return tx;

    tx.status = "FINALIZED";
    return tx;
  }

  reverse(id) {
    const tx = this.pending.get(id);
    if (!tx) return null;

    tx.status = "REVERSED";
    ledger.credit(tx.from, tx.amount);
    ledger.debit(tx.to, tx.amount);

    return tx;
  }
}

module.exports = new SettlementEngine();
