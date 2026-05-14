const fs = require("fs");
const path = require("path");

const hub = require("../realtime/event.hub");

class LiquidityV8 {

  constructor() {

    this.file = path.join(
      __dirname,
      "liquidity.v8.json"
    );

    this._bootstrap();
  }

  _bootstrap() {

    if (!fs.existsSync(this.file)) {

      fs.writeFileSync(
        this.file,
        JSON.stringify({
          pools: {
            AFRICOIN: {
              reserve: 1000000
            },
            NGN: {
              reserve: 500000
            },
            USDT: {
              reserve: 10000
            },
            BTC: {
              reserve: 1
            }
          },

          rates: {
            "NGN_AFRICOIN": 1,
            "AFRICOIN_USDT": 0.01,
            "USDT_BTC": 0.00001
          },

          wallets: {}
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

  createWallet(userId) {

    const db = this._read();

    if (db.wallets[userId]) {
      return {
        ok: false,
        error: "wallet_exists"
      };
    }

    db.wallets[userId] = {
      AFRICOIN: 0,
      NGN: 0,
      USDT: 0,
      BTC: 0
    };

    this._write(db);

    return {
      ok: true,
      wallet: db.wallets[userId]
    };
  }

  deposit(userId, asset, amount) {

    const db = this._read();

    if (!db.wallets[userId]) {
      return {
        ok: false,
        error: "wallet_not_found"
      };
    }

    if (!db.wallets[userId][asset] && db.wallets[userId][asset] !== 0) {
      return {
        ok: false,
        error: "unsupported_asset"
      };
    }

    db.wallets[userId][asset] += amount;

    if (db.pools[asset]) {
      db.pools[asset].reserve += amount;
    }

    this._write(db);

    hub.emitEvent({
      type: "liquidity.deposit",
      userId,
      asset,
      amount,
      ts: Date.now()
    });

    return {
      ok: true,
      balance: db.wallets[userId][asset]
    };
  }

  convert(userId, fromAsset, toAsset, amount) {

    const db = this._read();

    if (!db.wallets[userId]) {
      return {
        ok: false,
        error: "wallet_not_found"
      };
    }

    const pair =
      fromAsset + "_" + toAsset;

    const rate = db.rates[pair];

    if (!rate) {
      return {
        ok: false,
        error: "pair_not_supported"
      };
    }

    if (db.wallets[userId][fromAsset] < amount) {
      return {
        ok: false,
        error: "insufficient_balance"
      };
    }

    const converted =
      amount * rate;

    db.wallets[userId][fromAsset] -= amount;
    db.wallets[userId][toAsset] += converted;

    this._write(db);

    hub.emitEvent({
      type: "liquidity.convert",
      userId,
      fromAsset,
      toAsset,
      amount,
      converted,
      rate,
      ts: Date.now()
    });

    return {
      ok: true,
      converted,
      rate,
      balances: db.wallets[userId]
    };
  }

  snapshot() {

    const db = this._read();

    return {
      ok: true,
      pools: db.pools,
      rates: db.rates,
      wallets: Object.keys(db.wallets).length
    };
  }
}

module.exports = new LiquidityV8();
