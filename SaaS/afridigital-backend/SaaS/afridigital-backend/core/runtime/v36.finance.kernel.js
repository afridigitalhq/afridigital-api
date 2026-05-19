const { assertApiVersion } = require("../runtime/safety/api.guard");
const Ledger = require('../../finance/ledger.engine');
const SettlementEngine = require('../settlement/v36.settlement.engine');
const Rollback = require('../rollback/v36.rollback.arbiter');

class FinanceKernelV36 {
  constructor() {
    this.ledger = new Ledger();
    this.settlement = new SettlementEngine(this.ledger);
    this.rollback = new Rollback(this.ledger);
  }

  initiateCredit(userId, amount) {
    return this.settlement.authorize({
      userId,
      amount,
      type: "CREDIT"
    });
  }

  initiateDebit(userId, amount) {
    return this.settlement.authorize({
      userId,
      amount,
      type: "DEBIT"
    });
  }

  settle(txId) {
    return this.settlement.settle(txId);
  }

  rollback(txId, reason) {
    return this.rollback.reverse(txId, reason);
  }

  getSnapshot() {
    return this.ledger.snapshot();
  }
}

module.exports = new FinanceKernelV36();
