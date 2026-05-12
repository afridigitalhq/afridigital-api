const { assertApiVersion } = require("../runtime/safety/api.guard");
const Ledger = require("../../finance/ledger.engine");
const Prevent = require("../risk/v35.prevent.engine");
const Healing = require("../risk/v35.healing.engine");
const Graph = require("../risk/v35.graph.engine");

class SettlementArbitratorV36 {
  constructor() {
    this.ledger = new Ledger();
    this.history = [];
  }

  // -----------------------------
  // SINGLE SOURCE OF FINANCIAL TRUTH
  // -----------------------------
  executeTx(userId, type, amount) {
    const block = Prevent.intercept({ userId, amount });

    if (!block.allowed) {
      return { status: "BLOCKED", reason: block.reason };
    }

    let result;

    if (type === "CREDIT") {
      result = this.ledger.credit(userId, amount, { v36: true });
    } else {
      result = this.ledger.debit(userId, amount, { v36: true });
    }

    const risk = Graph.evaluate(userId);
    const heal = Healing.update(userId);

    this.history.push({
      userId,
      type,
      amount,
      riskScore: risk.riskScore,
      recovery: heal.recoveryScore,
      ts: Date.now()
    });

    return {
      status: "SETTLED",
      balance: result,
      risk: risk.riskScore,
      recovery: heal.recoveryScore
    };
  }

  // -----------------------------
  // FINAL LEDGER AUTHORITY
  // -----------------------------
  getFinalLedger() {
    return {
      ledger: this.ledger.snapshot(),
      auditTrail: this.history.slice(-200)
    };
  }

  reconcile() {
    // truth enforcement pass
    return this.getFinalLedger();
  }
}

module.exports = new SettlementArbitratorV36();
