const { assertApiVersion } = require("../runtime/safety/api.guard");
const Ledger = require('../../finance/ledger.engine');
const Idempotency = require('../safety/idempotency.store');

class FinanceKernel {
  constructor() {
    this.ledger = new Ledger();
  }

  _key(action, userId, amount) {
    return `${action}:${userId}:${amount}:${Date.now() >> 10}`;
  }

  topUp(userId, amount) {
    const key = this._key("TOPUP", userId, amount);

    if (Idempotency.has(key)) return "DUPLICATE_BLOCKED";
    Idempotency.save(key);

    return this.ledger.credit(userId, amount, {
      source: "TOP_UP",
      idempotent: true
    });
  }

  withdraw(userId, amount) {
    const key = this._key("WITHDRAW", userId, amount);

    if (Idempotency.has(key)) return "DUPLICATE_BLOCKED";
    Idempotency.save(key);

    return this.ledger.debit(userId, amount, {
      source: "WITHDRAWAL",
      idempotent: true
    });
  }

  internalTransfer(a, b, amount) {
    this.ledger.debit(a, amount);
    this.ledger.credit(b, amount);
  }

  getSnapshot() {
    return this.ledger.snapshot();
  }
}

module.exports = new FinanceKernel();
