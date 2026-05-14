/**
 * AFRIBANK RAIL ENGINE V7.4
 * Unified payment routing layer:
 * Paystack + Crypto + AFRICOIN
 */

const ledger = require("../ledger/ledger.v7.3");
const fraud = require("../ledger/fraud.v7.2");
const hub = require("../realtime/event.hub");

class RailV7_4 {

  topupFiat(userId, amount, provider = "paystack") {
    const result = ledger.credit(userId, amount, {
      type: "fiat_topup",
      provider
    });

    hub.emitEvent({
      type: "rail.topup.fiat",
      userId,
      amount,
      provider,
      ts: Date.now()
    });

    return result;
  }

  topupCrypto(userId, amount, asset = "BTC") {
    const converted = this._convertToAfricoin(amount, asset);

    const result = ledger.credit(userId, converted, {
      type: "crypto_topup",
      asset,
      originalAmount: amount
    });

    hub.emitEvent({
      type: "rail.topup.crypto",
      userId,
      asset,
      amount,
      converted,
      ts: Date.now()
    });

    return result;
  }

  withdrawFiat(userId, amount, provider = "paystack") {
    const guard = fraud.guardTransaction({ userId, amount });
    if (!guard.allowed) return { ok: false, error: "fraud_blocked" };

    const debit = ledger.debit(userId, amount, {
      type: "fiat_withdrawal",
      provider
    });

    hub.emitEvent({
      type: "rail.withdraw.fiat",
      userId,
      amount,
      provider,
      ts: Date.now()
    });

    return debit;
  }

  withdrawCrypto(userId, amount, asset = "BTC") {
    const guard = fraud.guardTransaction({ userId, amount });
    if (!guard.allowed) return { ok: false, error: "fraud_blocked" };

    const debit = ledger.debit(userId, amount, {
      type: "crypto_withdrawal",
      asset
    });

    hub.emitEvent({
      type: "rail.withdraw.crypto",
      userId,
      amount,
      asset,
      ts: Date.now()
    });

    return debit;
  }

  convert(userId, amount, direction = "AFRICOIN_TO_CRYPTO") {
    const guard = fraud.guardTransaction({ userId, amount });
    if (!guard.allowed) return { ok: false, error: "fraud_blocked" };

    const fee = Math.ceil(amount * 0.01);

    let result;

    if (direction === "AFRICOIN_TO_CRYPTO") {
      result = ledger.debit(userId, amount + fee, { type: "convert_out" });
    } else {
      result = ledger.credit(userId, amount - fee, { type: "convert_in" });
    }

    hub.emitEvent({
      type: "rail.convert",
      userId,
      amount,
      fee,
      direction,
      ts: Date.now()
    });

    return result;
  }

  _convertToAfricoin(amount, asset) {
    // simplified conversion table (mock)
    const rates = {
      BTC: 45000000,
      ETH: 3000000,
      USDT: 1500
    };

    const rate = rates[asset] || 1;
    return Math.floor(amount * (rate / 1000000));
  }
}

module.exports = new RailV7_4();
