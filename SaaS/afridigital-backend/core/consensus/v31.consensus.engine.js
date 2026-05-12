const { assertApiVersion } = require("../runtime/safety/api.guard");
const Ledger = require('../../finance/ledger.engine');
const EventLog = require('../distributed/event.log');

class ConsensusEngine {
  constructor() {
    this.ledger = new Ledger();
    this.seenOps = new Set();
  }

  isDuplicate(opId) {
    if (this.seenOps.has(opId)) return true;
    this.seenOps.add(opId);
    return false;
  }

  topUp(userId, amount, opId = Date.now()) {
    if (this.isDuplicate(opId)) return "DUPLICATE_BLOCKED";

    const result = this.ledger.credit(userId, amount, {
      source: "TOP_UP",
      state: "SETTLED",
      opId
    });

    EventLog.append({
      type: "CREDIT",
      userId,
      amount,
      opId,
      state: "SETTLED"
    });

    return result;
  }

  withdraw(userId, amount, opId = Date.now()) {
    if (this.isDuplicate(opId)) return "DUPLICATE_BLOCKED";

    const result = this.ledger.debit(userId, amount, {
      source: "WITHDRAWAL",
      state: "SETTLED",
      opId
    });

    EventLog.append({
      type: "DEBIT",
      userId,
      amount,
      opId,
      state: "SETTLED"
    });

    return result;
  }

  internalTransfer(a, b, amount, opId = Date.now()) {
    if (this.isDuplicate(opId)) return "DUPLICATE_BLOCKED";

    const tx = {
      state: "PENDING",
      opId
    };

    this.ledger.debit(a, amount, { tx });
    this.ledger.credit(b, amount, { tx });

    tx.state = "SETTLED";

    EventLog.append({
      type: "TRANSFER",
      from: a,
      to: b,
      amount,
      opId,
      state: tx.state
    });

    return tx.state;
  }

  replayValidate(events) {
    const state = new Map();

    for (const e of events) {
      const current = state.get(e.userId) || 0;

      if (e.type === "CREDIT") {
        state.set(e.userId, current + e.amount);
      }

      if (e.type === "DEBIT") {
        state.set(e.userId, current - e.amount);
      }
    }

    return Object.fromEntries(state);
  }

  getSnapshot() {
    return {
      ledger: this.ledger.snapshot(),
      events: EventLog.replay()
    };
  }
}

module.exports = new ConsensusEngine();
