const fs = require("fs");
const path = require("path");

const ledger = require("../ledger/ledger.v7.3");
const hub = require("../realtime/event.hub");

class ReconciliationV7_5_PP {

  constructor() {

    this.file = path.join(
      __dirname,
      "reconciliation.v7.5++.json"
    );

    this._bootstrap();
  }

  _bootstrap() {

    if (!fs.existsSync(this.file)) {

      fs.writeFileSync(
        this.file,
        JSON.stringify({
          reserves: {
            AFRICOIN: 0
          },
          liabilities: {},
          settlements: [],
          lastReconciledAt: null
        }, null, 2)
      );
    }
  }

  _read() {
    return JSON.parse(
      fs.readFileSync(this.file, "utf-8")
    );
  }

  _write(data) {
    fs.writeFileSync(
      this.file,
      JSON.stringify(data, null, 2)
    );
  }

  reserve(asset, amount) {

    if (typeof amount !== "number" || amount <= 0) {
      return {
        ok: false,
        error: "invalid_amount"
      };
    }

    const db = this._read();

    if (!db.reserves[asset]) {
      db.reserves[asset] = 0;
    }

    db.reserves[asset] += amount;

    db.lastReconciledAt = Date.now();

    this._write(db);

    const event = {
      type: "reserve.updated",
      asset,
      amount,
      total: db.reserves[asset],
      ts: Date.now()
    };

    hub.emitEvent(event);

    return {
      ok: true,
      asset,
      reserve: db.reserves[asset]
    };
  }

  liability(userId, amount) {

    if (
      typeof userId !== "string" ||
      userId.length < 3
    ) {
      return {
        ok: false,
        error: "invalid_user"
      };
    }

    if (typeof amount !== "number" || amount <= 0) {
      return {
        ok: false,
        error: "invalid_amount"
      };
    }

    const db = this._read();

    if (!db.liabilities[userId]) {
      db.liabilities[userId] = 0;
    }

    db.liabilities[userId] += amount;

    db.lastReconciledAt = Date.now();

    this._write(db);

    const event = {
      type: "liability.updated",
      userId,
      amount,
      total: db.liabilities[userId],
      ts: Date.now()
    };

    hub.emitEvent(event);

    return {
      ok: true,
      userId,
      liability: db.liabilities[userId]
    };
  }

  settle(userId, amount) {

    const db = this._read();

    if (!db.liabilities[userId]) {
      return {
        ok: false,
        error: "no_liability_found"
      };
    }

    if (db.liabilities[userId] < amount) {
      return {
        ok: false,
        error: "settlement_exceeds_liability"
      };
    }

    db.liabilities[userId] -= amount;

    db.settlements.push({
      userId,
      amount,
      ts: Date.now()
    });

    db.lastReconciledAt = Date.now();

    this._write(db);

    ledger.credit(
      userId,
      amount,
      {
        type: "settlement_credit"
      }
    );

    const event = {
      type: "settlement.completed",
      userId,
      amount,
      ts: Date.now()
    };

    hub.emitEvent(event);

    return {
      ok: true,
      userId,
      settled: amount,
      remainingLiability:
        db.liabilities[userId]
    };
  }

  snapshot() {

    const db = this._read();

    return {
      ok: true,
      reserves: db.reserves,
      liabilities: db.liabilities,
      settlements: db.settlements.length,
      lastReconciledAt: db.lastReconciledAt
    };
  }
}

module.exports = new ReconciliationV7_5_PP();
