const { assertApiVersion } = require("../runtime/safety/api.guard");
const State = require('../ledger-state/v36.state.store');

class SettlementEngine {
  constructor(ledger) {
    this.ledger = ledger;
  }

  authorize(tx) {
    const txId = `${tx.userId}-${Date.now()}-${Math.random()}`;

    State.stage(txId, tx);

    return {
      txId,
      status: "AUTHORIZED"
    };
  }

  settle(txId) {
    const tx = State.commit(txId);
    if (!tx) return { status: "FAILED", reason: "UNKNOWN_TX" };

    if (tx.type === "CREDIT") {
      this.ledger.credit(tx.userId, tx.amount, { settlement: true });
    }

    if (tx.type === "DEBIT") {
      this.ledger.debit(tx.userId, tx.amount, { settlement: true });
    }

    return {
      txId,
      status: "SETTLED"
    };
  }
}

module.exports = SettlementEngine;
