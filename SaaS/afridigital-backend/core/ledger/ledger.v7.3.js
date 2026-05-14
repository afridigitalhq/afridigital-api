/**
 * AFRIBANK LEDGER ENGINE V7.3
 * Unified transaction orchestration layer
 */

const fraud = require("../ledger/fraud.v7.2");
const hub = require("../realtime/event.hub");

class LedgerV7_3 {
  constructor() {
    this.balances = new Map(); // userId -> AFRICOIN balance
  }

  _getBalance(userId) {
    return this.balances.get(userId) || 0;
  }

  _setBalance(userId, amount) {
    this.balances.set(userId, amount);
  }

  _fee(amount) {
    // simple transfer fee model (1.5%)
    return Math.ceil(amount * 0.015);
  }

  credit(userId, amount, meta = {}) {
    const current = this._getBalance(userId);
    this._setBalance(userId, current + amount);

    const event = {
      type: "ledger.credit",
      userId,
      amount,
      meta,
      ts: Date.now()
    };

    hub.emitEvent(event);
    return { ok: true, balance: this._getBalance(userId) };
  }

  debit(userId, amount, meta = {}) {
    const current = this._getBalance(userId);
    if (current < amount) return { ok: false, error: "insufficient_funds" };

    this._setBalance(userId, current - amount);

    const event = {
      type: "ledger.debit",
      userId,
      amount,
      meta,
      ts: Date.now()
    };

    hub.emitEvent(event);
    return { ok: true, balance: this._getBalance(userId) };
  }

  transfer(fromUser, toUser, amount) {
    if (fraud.isFrozen(fromUser)) {
      return { ok: false, error: "wallet_frozen" };
    }

    const guard = fraud.guardTransaction({ userId: fromUser, amount });

    if (!guard.allowed) {
      return { ok: false, error: "fraud_blocked", guard };
    }

    const fee = this._fee(amount);
    const totalDebit = amount + fee;

    const debitRes = this.debit(fromUser, totalDebit, {
      type: "transfer_debit",
      fee
    });

    if (!debitRes.ok) return debitRes;

    const creditRes = this.credit(toUser, amount, {
      type: "transfer_credit"
    });

    const event = {
      type: "transfer.completed",
      fromUser,
      toUser,
      amount,
      fee,
      ts: Date.now()
    };

    hub.emitEvent(event);

    return {
      ok: true,
      from: fromUser,
      to: toUser,
      amount,
      fee,
      fromBalance: this._getBalance(fromUser),
      toBalance: this._getBalance(toUser)
    };
  }
}

module.exports = new LedgerV7_3();
