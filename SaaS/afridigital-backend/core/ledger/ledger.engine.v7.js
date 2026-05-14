const crypto = require("crypto");

/**
 * AFRIBANK LEDGER ENGINE V7
 * Core financial abstraction layer:
 * - crypto topups → AFRICOIN
 * - AFRICOIN ↔ crypto conversion
 * - AFRICOIN withdrawals → external
 * - user transfers
 * - fiat ↔ AFRICOIN gateway abstraction
 */

class LedgerEngineV7 {
  constructor() {
    this.accounts = new Map(); // userId -> balance
    this.journal = [];
  }

  _get(userId) {
    if (!this.accounts.has(userId)) {
      this.accounts.set(userId, { africoin: 0 });
    }
    return this.accounts.get(userId);
  }

  _log(entry) {
    this.journal.push({
      id: crypto.randomUUID(),
      ts: Date.now(),
      ...entry
    });
  }

  // TOPUP: crypto → AFRICOIN OR fiat → AFRICOIN
  topup(userId, amount, source = "crypto") {
    const acc = this._get(userId);
    acc.africoin += amount;

    this._log({
      type: "topup",
      userId,
      amount,
      source,
      balance: acc.africoin
    });

    return { ok: true, balance: acc.africoin };
  }

  // CONVERT: AFRICOIN ↔ crypto
  convert(userId, amount, direction = "to_crypto") {
    const acc = this._get(userId);

    if (direction === "to_crypto") {
      if (acc.africoin < amount) return { ok: false, error: "insufficient_funds" };
      acc.africoin -= amount;
    } else {
      acc.africoin += amount;
    }

    this._log({
      type: "convert",
      userId,
      amount,
      direction,
      balance: acc.africoin
    });

    return { ok: true, balance: acc.africoin };
  }

  // WITHDRAW: AFRICOIN → external fiat/crypto
  withdraw(userId, amount, destination = "external") {
    const acc = this._get(userId);

    if (acc.africoin < amount) return { ok: false, error: "insufficient_funds" };
    acc.africoin -= amount;

    this._log({
      type: "withdraw",
      userId,
      amount,
      destination,
      balance: acc.africoin
    });

    return { ok: true, balance: acc.africoin };
  }

  // TRANSFER: user → user
  transfer(fromUser, toUser, amount) {
    const sender = this._get(fromUser);
    const receiver = this._get(toUser);

    if (sender.africoin < amount) {
      return { ok: false, error: "insufficient_funds" };
    }

    sender.africoin -= amount;
    receiver.africoin += amount;

    this._log({
      type: "transfer",
      fromUser,
      toUser,
      amount
    });

    return { ok: true };
  }

  // READ LEDGER
  getLedger(limit = 50) {
    return {
      ok: true,
      total: this.journal.length,
      events: this.journal.slice(-limit)
    };
  }
}

module.exports = new LedgerEngineV7();
