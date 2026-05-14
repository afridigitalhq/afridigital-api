const hub = require("../realtime/event.hub");
const ledger = require("../ledger/ledger.v7.3");
const liquidity = require("../liquidity/liquidity.balancer.v8.2");
const fx = require("../fx/fx.router.v8.1");

/**
 * V9 SETTLEMENT NETWORK CORE
 * Finality + atomic transaction layer
 */

class SettlementV9 {

  constructor() {
    this.pending = new Map();
    this.finalized = [];
  }

  begin(tx) {

    const id = Date.now() + "_" + Math.random();

    const record = {
      id,
      status: "PENDING",
      tx,
      ts: Date.now()
    };

    this.pending.set(id, record);

    hub.emitEvent({
      type: "settlement.begin",
      id,
      tx
    });

    return { ok: true, id };
  }

  validate(tx) {

    if (!tx || !tx.from || !tx.to || !tx.amount) {
      return { ok: false, error: "invalid_tx" };
    }

    if (tx.amount <= 0) {
      return { ok: false, error: "invalid_amount" };
    }

    return { ok: true };
  }

  execute(id) {

    const record = this.pending.get(id);

    if (!record) {
      return { ok: false, error: "tx_not_found" };
    }

    const tx = record.tx;

    const debit = ledger.transfer(tx.from, "SYSTEM", tx.amount);

    if (!debit.ok) {
      record.status = "FAILED";
      return debit;
    }

    const credit = ledger.credit(tx.to, tx.amount);

    record.status = "CONFIRMED";

    this.finalized.push(record);
    this.pending.delete(id);

    hub.emitEvent({
      type: "settlement.finalized",
      id,
      tx
    });

    return {
      ok: true,
      status: "FINALIZED",
      id
    };
  }

  snapshot() {

    return {
      ok: true,
      pending: this.pending.size,
      finalized: this.finalized.length
    };
  }
}

module.exports = new SettlementV9();
