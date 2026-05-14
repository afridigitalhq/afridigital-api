const fs = require("fs");
const path = require("path");
const hub = require("../realtime/event.hub");

/**
 * V8.2 LIQUIDITY BALANCER ENGINE
 * - reserve protection
 * - overdraft prevention
 * - liquidity drift correction
 * - auto rebalancing logic (simulated)
 */

class LiquidityBalancerV8_2 {

  constructor() {

    this.file = path.join(
      __dirname,
      "liquidity.v8.json"
    );

    this.limits = {
      AFRICOIN: { min: 50000, max: 5000000 },
      NGN: { min: 100000, max: 10000000 },
      USD: { min: 1000, max: 100000 },
      GHS: { min: 1000, max: 5000000 },
      USDT: { min: 100, max: 500000 }
    };
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

  analyzePressure() {

    const db = this._read();

    const report = {};

    for (const asset in db.pools) {

      const reserve = db.pools[asset].reserve;
      const limit = this.limits[asset] || { min: 0, max: Infinity };

      let status = "stable";

      if (reserve < limit.min) status = "LOW_PRESSURE";
      if (reserve > limit.max) status = "OVERFLOW";

      report[asset] = {
        reserve,
        status,
        min: limit.min,
        max: limit.max
      };
    }

    return {
      ok: true,
      report
    };
  }

  enforceReserveLimits() {

    const db = this._read();
    let adjusted = 0;

    for (const asset in db.pools) {

      const reserve = db.pools[asset].reserve;
      const limit = this.limits[asset] || { min: 0, max: Infinity };

      if (reserve < limit.min) {
        db.pools[asset].reserve = limit.min;
        adjusted++;
      }

      if (reserve > limit.max) {
        db.pools[asset].reserve = limit.max;
        adjusted++;
      }
    }

    this._write(db);

    hub.emitEvent({
      type: "liquidity.reserve.enforced",
      adjusted,
      ts: Date.now()
    });

    return {
      ok: true,
      adjusted
    };
  }

  rebalancePools() {

    const db = this._read();

    const actions = [];

    const assets = Object.keys(db.pools);

    for (let i = 0; i < assets.length; i++) {

      for (let j = i + 1; j < assets.length; j++) {

        const a = assets[i];
        const b = assets[j];

        const diff =
          db.pools[a].reserve -
          db.pools[b].reserve;

        // simple balancing heuristic
        if (Math.abs(diff) > 100000) {

          const transfer = Math.floor(Math.abs(diff) * 0.1);

          if (diff > 0) {
            db.pools[a].reserve -= transfer;
            db.pools[b].reserve += transfer;
          } else {
            db.pools[b].reserve -= transfer;
            db.pools[a].reserve += transfer;
          }

          actions.push({
            from: diff > 0 ? a : b,
            to: diff > 0 ? b : a,
            amount: transfer
          });
        }
      }
    }

    this._write(db);

    hub.emitEvent({
      type: "liquidity.rebalance",
      actions,
      ts: Date.now()
    });

    return {
      ok: true,
      actions
    };
  }

  snapshot() {

    const db = this._read();

    return {
      ok: true,
      pools: db.pools,
      limits: this.limits,
      assets: Object.keys(db.pools)
    };
  }
}

module.exports = new LiquidityBalancerV8_2();
