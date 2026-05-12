const { assertApiVersion } = require("../runtime/safety/api.guard");

class PaystackIsolationGuard {

  /**
   * 🔒 FINANCE BOUNDARY (HARD RULE)
   * Paystack ONLY:
   * - TOP_UP (fiat → Africoin deposit)
   * - WITHDRAWAL (Africoin → fiat payout)
   */
  static ALLOWED = new Set(["TOP_UP", "WITHDRAWAL"]);

  /**
   * 🚫 FORBIDDEN FROM PAYSTACK LAYER
   * Anything that is internal economy is STRICTLY blocked
   */
  static FORBIDDEN = new Set([
    "AD_PRICING",
    "AD_RANKING",
    "REWARDS",
    "LIQUIDITY_ENGINE",
    "FORECASTING",
    "PREMIUM",
    "INTERNAL_TRANSFERS",
    "AI_ECONOMY"
  ]);

  /**
   * 🧠 VALIDATE FINANCIAL SCOPE
   */
  static validate(scope) {

    if (this.FORBIDDEN.has(scope)) {
      throw new Error("🚫 PAYSTACK VIOLATION: " + scope + " is internal economy (blocked)");
    }

    if (!this.ALLOWED.has(scope)) {
      throw new Error("🚫 UNKNOWN FINANCE SCOPE: " + scope);
    }

    return true;
  }

  /**
   * 💳 SAFE EXECUTION WRAPPER
   */
  static execute(scope, fn) {

    this.validate(scope);
    return fn();
  }
}

module.exports = PaystackIsolationGuard;

