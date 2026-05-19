/**
 * AFRIBANK SETTLEMENT ENGINE V7.5
 * Transaction lifecycle manager:
 * pending → confirmed → finalized
 */

const ledger = require("../ledger/ledger.v7.3");
const fraud = require("../ledger/fraud.v7.2");
const hub = require("../realtime/event.hub");

class SettlementV7_5 {
  constructor() {
    this.pending = new Map();
    this.confirmed = new Map();
    this.finalized = new Map();
  }

  createTransaction(tx) {
    const id = tx.id || require("crypto").randomUUID();

    const enriched = {
      ...tx,
      id,
      status: "PENDING",
      createdAt: Date.now()
    };

    this.pending.set(id, enriched);

    hub.emitEvent({
      type: "settlement.created",
      txId: id,
      status: "PENDING",
      ts: Date.now()
    });

    return enriched;
  }

  confirm(txId) {
    const tx = this.pending.get(txId);
    if (!tx) return { ok: false, error: "not_found" };

    const guard = fraud.guardTransaction({
      userId: tx.userId,
      amount: tx.amount
    });

    if (!guard.allowed) {
      tx.status = "REJECTED";
      return { ok: false, error: "fraud_blocked", guard };
    }

    tx.status = "CONFIRMED";
    this.pending.delete(txId);
    this.confirmed.set(txId, tx);

    hub.emitEvent({
      type: "settlement.confirmed",
      txId,
      ts: Date.now()
    });

    return { ok: true, tx };
  }

  finalize(txId) {
    const tx = this.confirmed.get(txId);
    if (!tx) return { ok: false, error: "not_confirmed" };

    let result;

    switch (tx.type) {
      case "credit":
        result = ledger.credit(tx.userId, tx.amount, tx.meta);
        break;

      case "debit":
        result = ledger.debit(tx.userId, tx.amount, tx.meta);
        break;

      case "transfer":
        result = ledger.transfer(tx.fromUser, tx.toUser, tx.amount);
        break;

      default:
        return { ok: false, error: "invalid_tx_type" };
    }

    tx.status = "FINALIZED";
    this.confirmed.delete(txId);
    this.finalized.set(txId, tx);

    hub.emitEvent({
      type: "settlement.finalized",
      txId,
      ts: Date.now()
    });

    return {
      ok: true,
      tx,
      ledgerResult: result
    };
  }

  reverse(txId, reason = "manual_reversal") {
    const tx = this.finalized.get(txId);
    if (!tx) return { ok: false, error: "not_finalized" };

    const reversal = {
      id: require("crypto").randomUUID(),
      originalTx: txId,
      type: "reversal",
      reason,
      amount: tx.amount,
      userId: tx.userId,
      ts: Date.now()
    };

    ledger.credit(tx.userId, tx.amount, {
      type: "reversal",
      reason
    });

    hub.emitEvent({
      type: "settlement.reversed",
      reversal
    });

    return { ok: true, reversal };
  }

  status(txId) {
    return {
      pending: this.pending.get(txId) || null,
      confirmed: this.confirmed.get(txId) || null,
      finalized: this.finalized.get(txId) || null
    };
  }
}

module.exports = new SettlementV7_5();
