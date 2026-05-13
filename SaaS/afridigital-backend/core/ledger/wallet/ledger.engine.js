const router = require('../router/event.router');
class WalletLedgerEngine {
  constructor(router) {
    this.router = router;
  }

  credit(userId, amount, meta = {}) {
    const event = {
      type: "ledger.credit",
      userId,
      amount,
      meta,
      ts: Date.now()
    };

    this.router.publish("ledger", event);
    this.router.publish("wallet", event);
    return event;
  }

  debit(userId, amount, meta = {}) {
    const event = {
      type: "ledger.debit",
      userId,
      amount,
      meta,
      ts: Date.now()
    };

    this.router.publish("ledger", event);
    this.router.publish("wallet", event);
    return event;
  }
}

module.exports = WalletLedgerEngine;
