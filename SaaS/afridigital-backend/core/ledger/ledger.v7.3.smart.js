const fraud = require("./fraud.v7.2");
const hub = require("../realtime/event.hub");

class LedgerV7_3_Smart {
  constructor(baseLedger) {
    this.ledger = baseLedger;
  }

  _baseFee(amount) {
    return Math.ceil(amount * 0.015);
  }

  _riskMultiplier(score) {
    if (score >= 80) return 2.5;
    if (score >= 50) return 1.5;
    if (score >= 20) return 1.2;
    return 1;
  }

  _velocitySurcharge(velocity) {
    if (velocity > 10) return 1.5;
    if (velocity > 5) return 1.2;
    return 1;
  }

  transfer(fromUser, toUser, amount) {

    if (fraud.isFrozen(fromUser)) {
      return { ok: false, error: "wallet_frozen" };
    }

    const guard = fraud.guardTransaction({
      userId: fromUser,
      amount
    });

    if (!guard.allowed) {
      return {
        ok: false,
        error: "fraud_blocked",
        guard
      };
    }

    const baseFee = this._baseFee(amount);

    const riskFee = Math.ceil(
      baseFee * this._riskMultiplier(guard.score || 0)
    );

    const velocityFee = Math.ceil(
      baseFee * this._velocitySurcharge(guard.velocity || 0)
    );

    const totalFee = baseFee + riskFee + velocityFee;

    const totalDebit = amount + totalFee;

    const debitRes = this.ledger.debit(fromUser, totalDebit, {
      type: "transfer_debit",
      fee: totalFee,
      breakdown: {
        baseFee,
        riskFee,
        velocityFee
      }
    });

    if (!debitRes.ok) return debitRes;

    const creditRes = this.ledger.credit(toUser, amount, {
      type: "transfer_credit"
    });

    const event = {
      type: "transfer.completed.v7_3",
      fromUser,
      toUser,
      amount,
      fee: totalFee,
      ts: Date.now()
    };

    hub.emitEvent(event);

    return {
      ok: true,
      from: fromUser,
      to: toUser,
      amount,
      fee: totalFee,
      breakdown: {
        baseFee,
        riskFee,
        velocityFee
      }
    };
  }
}

module.exports = LedgerV7_3_Smart;
