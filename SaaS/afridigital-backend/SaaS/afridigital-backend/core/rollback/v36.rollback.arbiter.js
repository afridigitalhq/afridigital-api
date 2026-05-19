const { assertApiVersion } = require("../runtime/safety/api.guard");
const State = require('../ledger-state/v36.state.store');

class RollbackArbiter {
  constructor(ledger) {
    this.ledger = ledger;
  }

  reverse(txId, reason = "RISK_TRIGGERED") {
    const tx = State.rollback(txId, reason);
    if (!tx) return { status: "NOT_FOUND" };

    if (tx.type === "CREDIT") {
      this.ledger.debit(tx.userId, tx.amount, { rollback: true });
    }

    if (tx.type === "DEBIT") {
      this.ledger.credit(tx.userId, tx.amount, { rollback: true });
    }

    return {
      txId,
      status: "REVERSED",
      reason
    };
  }
}

module.exports = RollbackArbiter;
