const fx = require("../fx/fx.router.v8.1");
const liquidity = require("../liquidity/liquidity.v8.json");
const hub = require("../realtime/event.hub");

/**
 * V8.3 CROSS-CHAIN ROUTER
 * Unified asset routing engine
 */

class CrossChainRouterV8_3 {

  constructor() {

    this.cryptoRates = {
      USDT: 1,
      BTC: 60000
    };
  }

  _fiat(country) {

    const map = {
      NG: "NGN",
      GH: "GHS",
      US: "USD",
      EU: "EUR"
    };

    return map[country] || "USD";
  }

  route(fromAsset, toAsset, amount, country = "US") {

    let result = amount;

    // STEP 1: Normalize to fiat if needed
    if (fromAsset === "AFRICOIN") {

      const fiat = fx.africoinToFiat(country, amount);

      if (!fiat.ok) return fiat;

      result = fiat.value;
      fromAsset = this._fiat(country);
    }

    // STEP 2: Fiat → crypto or crypto → crypto
    if (toAsset === "USDT" || toAsset === "BTC") {

      const rate = this.cryptoRates[toAsset];

      const converted = result * rate;

      hub.emitEvent({
        type: "crosschain.route",
        fromAsset,
        toAsset,
        amount,
        converted,
        ts: Date.now()
      });

      return {
        ok: true,
        from: fromAsset,
        to: toAsset,
        amount,
        converted
      };
    }

    // STEP 3: fiat ↔ fiat fallback (simple pass-through)
    hub.emitEvent({
      type: "crosschain.fiat.route",
      fromAsset,
      toAsset,
      amount: result,
      ts: Date.now()
    });

    return {
      ok: true,
      from: fromAsset,
      to: toAsset,
      amount: result
    };
  }

  snapshot() {

    return {
      ok: true,
      cryptoRates: this.cryptoRates
    };
  }
}

module.exports = new CrossChainRouterV8_3();
