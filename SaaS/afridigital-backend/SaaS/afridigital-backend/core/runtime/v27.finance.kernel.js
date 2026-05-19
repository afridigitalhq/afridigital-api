const { assertApiVersion } = require("../runtime/safety/api.guard");
const Ledger = require('../../finance/ledger.engine');
const AI = require('../adapters/ai.adapter');
const Market = require('../adapters/market.adapter');

class FinanceKernel {
  constructor() {
    this.ledger = new Ledger();
  }

  topUp(userId, amount) {
    return this.ledger.credit(userId, amount, { source: "TOP_UP" });
  }

  withdraw(userId, amount) {
    return this.ledger.debit(userId, amount, { source: "WITHDRAWAL" });
  }

  internalTransfer(a, b, amount) {
    this.ledger.debit(a, amount);
    this.ledger.credit(b, amount);
  }

  aiSignal(input) {
    return AI.predict(input);
  }

  marketSnapshot() {
    return Market.snapshot();
  }

  getSnapshot() {
    return this.ledger.snapshot();
  }
}

module.exports = new FinanceKernel();
