const hub = require("../realtime/event.hub");

/**
 * V8.1 SMART FX ROUTER
 * Fiat-anchored conversion layer for V8 liquidity engine
 */

class FxRouterV8_1 {

  constructor() {

    // base fiat anchors per region
    this.anchors = {
      NG: "NGN",
      GH: "GHS",
      US: "USD",
      EU: "EUR"
    };

    // simulated FX rates (can later be external API)
    this.fx = {
      "NGN_USD": 0.00065,
      "USD_NGN": 1530,

      "GHS_USD": 0.083,
      "USD_GHS": 12.0,

      "EUR_USD": 1.09,
      "USD_EUR": 0.92
    };

    // AFRICOIN peg per fiat (core abstraction layer)
    this.africoinPeg = {
      NGN: 1,
      GHS: 0.12,
      USD: 0.001,
      EUR: 0.0009
    };
  }

  getAnchor(countryCode) {
    return this.anchors[countryCode] || "USD";
  }

  // convert fiat → fiat
  fxConvert(from, to, amount) {

    const pair = `${from}_${to}`;
    const rate = this.fx[pair];

    if (!rate) {
      return { ok: false, error: "fx_pair_not_supported" };
    }

    return {
      ok: true,
      result: amount * rate,
      rate
    };
  }

  // AFRICOIN → fiat (region-aware)
  africoinToFiat(countryCode, amount) {

    const fiat = this.getAnchor(countryCode);
    const rate = this.africoinPeg[fiat];

    if (!rate) {
      return { ok: false, error: "peg_not_found" };
    }

    const value = amount * rate;

    hub.emitEvent({
      type: "fx.africoin.to.fiat",
      countryCode,
      fiat,
      amount,
      value,
      ts: Date.now()
    });

    return {
      ok: true,
      fiat,
      value
    };
  }

  // fiat → AFRICOIN
  fiatToAfricoin(countryCode, fiatAmount) {

    const fiat = this.getAnchor(countryCode);
    const rate = this.africoinPeg[fiat];

    if (!rate) {
      return { ok: false, error: "peg_not_found" };
    }

    const africoin = fiatAmount / rate;

    hub.emitEvent({
      type: "fx.fiat.to.africoin",
      countryCode,
      fiat,
      fiatAmount,
      africoin,
      ts: Date.now()
    });

    return {
      ok: true,
      africoin
    };
  }

  // full routing: AFRICOIN → USDT via fiat anchor
  africoinToCrypto(countryCode, amount, crypto = "USDT") {

    const fiatRes = this.africoinToFiat(countryCode, amount);

    if (!fiatRes.ok) return fiatRes;

    // simplified crypto conversion layer
    const cryptoRate = crypto === "USDT" ? 1 : 0.00001;

    const result = fiatRes.value * cryptoRate;

    hub.emitEvent({
      type: "fx.africoin.to.crypto",
      countryCode,
      crypto,
      amount,
      result,
      ts: Date.now()
    });

    return {
      ok: true,
      crypto,
      result,
      viaFiat: fiatRes.fiat
    };
  }
}

module.exports = new FxRouterV8_1();
