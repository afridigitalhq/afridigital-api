const { assertApiVersion } = require("../runtime/safety/api.guard");
const Ledger = require('../../finance/ledger.engine');
const TxHash = require('../distributed/tx.hash');
const EventLog = require('../distributed/event.log');

class FinanceKernel {
  constructor() {
    this.ledger = new Ledger();
  }

  topUp(userId, amount) {
    const hash = TxHash.create(userId, amount, "TOPUP");

    const result = this.ledger.credit(userId, amount, {
      hash,
      source: "TOP_UP",
      distributed: true
    });

    EventLog.append({ type: "CREDIT", userId, amount, hash });
    return result;
  }

  withdraw(userId, amount) {
    const hash = TxHash.create(userId, amount, "WITHDRAW");

    const result = this.ledger.debit(userId, amount, {
      hash,
      source: "WITHDRAWAL",
      distributed: true
    });

    EventLog.append({ type: "DEBIT", userId, amount, hash });
    return result;
  }

  internalTransfer(a, b, amount) {
    const hashA = TxHash.create(a, amount, "TRANSFER_OUT");
    const hashB = TxHash.create(b, amount, "TRANSFER_IN");

    this.ledger.debit(a, amount);
    this.ledger.credit(b, amount);

    EventLog.append({ type: "TRANSFER", from: a, to: b, amount, hashA, hashB });
  }

  getSnapshot() {
    return {
      ledger: this.ledger.snapshot(),
      events: EventLog.replay()
    };
  }
}

module.exports = new FinanceKernel();
