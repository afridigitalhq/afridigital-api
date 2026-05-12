const { assertApiVersion } = require("../runtime/safety/api.guard");
const Ledger = require('../../finance/ledger.engine');
const TxHash = require('../distributed/tx.hash');
const EventLog = require('../distributed/event.log');
const TxManager = require('../atomic/tx.manager');

class FinanceKernel {
  constructor() {
    this.ledger = new Ledger();
  }

  topUp(userId, amount) {
    const tx = TxManager.begin();

    try {
      const hash = TxHash.create(userId, amount, "TOPUP");

      const result = this.ledger.credit(userId, amount, {
        hash,
        source: "TOP_UP",
        atomic: true
      });

      TxManager.record({ type: "CREDIT", userId, amount, hash });

      EventLog.append({ type: "CREDIT", userId, amount, hash });

      TxManager.commit();
      return result;

    } catch (e) {
      TxManager.rollback();
      throw e;
    }
  }

  withdraw(userId, amount) {
    const tx = TxManager.begin();

    try {
      const hash = TxHash.create(userId, amount, "WITHDRAW");

      const result = this.ledger.debit(userId, amount, {
        hash,
        source: "WITHDRAWAL",
        atomic: true
      });

      TxManager.record({ type: "DEBIT", userId, amount, hash });

      EventLog.append({ type: "DEBIT", userId, amount, hash });

      TxManager.commit();
      return result;

    } catch (e) {
      TxManager.rollback();
      throw e;
    }
  }

  internalTransfer(a, b, amount) {
    const tx = TxManager.begin();

    try {
      const hashA = TxHash.create(a, amount, "TRANSFER_OUT");
      const hashB = TxHash.create(b, amount, "TRANSFER_IN");

      this.ledger.debit(a, amount);
      this.ledger.credit(b, amount);

      EventLog.append({ type: "TRANSFER", from: a, to: b, amount, hashA, hashB });

      TxManager.commit();

    } catch (e) {
      TxManager.rollback();
      throw e;
    }
  }

  rebuildFromEvents(events) {
    const fresh = new Ledger();

    for (const e of events) {
      if (e.type === "CREDIT") fresh.credit(e.userId, e.amount);
      if (e.type === "DEBIT") fresh.debit(e.userId, e.amount);
    }

    return fresh.snapshot();
  }

  getSnapshot() {
    return {
      ledger: this.ledger.snapshot(),
      events: EventLog.replay()
    };
  }
}

module.exports = new FinanceKernel();
