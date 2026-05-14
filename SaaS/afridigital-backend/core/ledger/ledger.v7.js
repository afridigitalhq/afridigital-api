const crypto = require("crypto");

/**
 * AFRIBANK LEDGER ENGINE V7.1
 * - AFRICOIN internal ledger
 * - Crypto + Fiat rails abstraction
 * - Transfer fees for P2P abuse control
 */

class LedgerV7 {
  constructor() {
    this.balances = new Map(); // userId -> balance
    this.feeRate = 0.01; // 1% transfer fee
    this.ledger = [];
  }

  _log(entry) {
    this.ledger.push(entry);
  }

  _getBalance(userId) {
    return this.balances.get(userId) || 0;
  }

  _setBalance(userId, amount) {
    this.balances.set(userId, amount);
  }

  // TOPUP (crypto/fiat -> AFRICOIN)
  topup({ userId, amount, rail = "crypto" }) {
    const credit = amount;

    const newBal = this._getBalance(userId) + credit;
    this._setBalance(userId, newBal);

    this._log({
      type: "topup",
      userId,
      rail,
      amount,
      credit,
      ts: Date.now()
    });

    return { ok: true, balance: newBal };
  }

  // CONVERT (AFRICOIN <-> crypto placeholder abstraction)
  convert({ userId, amount, direction }) {
    const bal = this._getBalance(userId);
    if (bal < amount) return { ok: false, error: "insufficient_funds" };

    const newBal = direction === "out"
      ? bal - amount
      : bal + amount;

    this._setBalance(userId, newBal);

    this._log({
      type: "convert",
      userId,
      amount,
      direction,
      ts: Date.now()
    });

    return { ok: true, balance: newBal };
  }

  // TRANSFER (user -> user) WITH FEE
  transfer({ from, to, amount }) {
    const fee = amount * this.feeRate;
    const totalDebit = amount + fee;

    const fromBal = this._getBalance(from);
    if (fromBal < totalDebit) {
      return { ok: false, error: "insufficient_funds" };
    }

    const toBal = this._getBalance(to);

    this._setBalance(from, fromBal - totalDebit);
    this._setBalance(to, toBal + amount);

    this._log({
      type: "transfer",
      from,
      to,
      amount,
      fee,
      ts: Date.now()
    });

    return {
      ok: true,
      fromBalance: this._getBalance(from),
      toBalance: this._getBalance(to)
    };
  }

  // WITHDRAW (AFRICOIN -> external rail)
  withdraw({ userId, amount, rail = "fiat" }) {
    const bal = this._getBalance(userId);
    if (bal < amount) return { ok: false, error: "insufficient_funds" };

    this._setBalance(userId, bal - amount);

    this._log({
      type: "withdraw",
      userId,
      amount,
      rail,
      ts: Date.now()
    });

    return { ok: true, balance: this._getBalance(userId) };
  }

  // FULL LEDGER VIEW
  getLedger(limit = 100) {
    return this.ledger.slice(-limit);
  }

  getBalance(userId) {
    return { userId, balance: this._getBalance(userId) };
  }
}

module.exports = new LedgerV7();
