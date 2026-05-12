
const EventEmitter = require("events");

/**
 * 🧠 V31 ECONOMIC ISOLATION CORE
 * HARD BOUNDARY BETWEEN:
 * - PAYSTACK (external fiat)
 * - AFRICOIN (internal economy)
 */
class EconomicIsolationCore extends EventEmitter {

  constructor() {

    super();

    this.state = {
      lastTopUp: {},
      lastWithdrawal: {},
      blockedSignals: 0
    };
  }

  /**
   * 🚨 PAYSTACK INPUT GATE (ONLY VALID ENTRY POINT)
   */
  handlePaystackEvent(event) {

    const { type, userId, amount } = event;

    // 🛑 STRICT WHITELIST
    if (type !== "TOP_UP" && type !== "WITHDRAWAL") {
      this.state.blockedSignals++;

      this.emit("violation", {
        reason: "INVALID PAYSTACK SCOPE",
        event
      });

      return { allowed: false };
    }

    // 🔒 TOP-UP → Mint Africoin ONLY
    if (type === "TOP_UP") {

      this.state.lastTopUp[userId] = Date.now();

      this.emit("mint_request", {
        userId,
        amount,
        source: "PAYSTACK_TOP_UP"
      });

      return {
        allowed: true,
        action: "MINT_AFRICOIN"
      };
    }

    // 💸 WITHDRAWAL → Burn Africoin ONLY
    if (type === "WITHDRAWAL") {

      this.state.lastWithdrawal[userId] = Date.now();

      this.emit("burn_request", {
        userId,
        amount,
        destination: "PAYSTACK_WITHDRAWAL"
      });

      return {
        allowed: true,
        action: "BURN_AFRICOIN"
      };
    }
  }

  /**
   * 🚫 INTERNAL ECONOMY PROTECTION
   * Prevent Paystack influence leakage into ad systems
   */
  sanitizeEconomicSignal(signal) {

    const forbidden = [
      "PAYSTACK_VOLUME",
      "FIAT_FLOW",
      "BANK_LIQUIDITY"
    ];

    if (forbidden.includes(signal.type)) {
      return {
        allowed: false,
        reason: "EXTERNAL_FIAT_SIGNAL_BLOCKED"
      };
    }

    return {
      allowed: true,
      signal
    };
  }

  /**
   * 📊 SYSTEM HEALTH SNAPSHOT
   */
  snapshot() {
    return {
      blockedSignals: this.state.blockedSignals,
      lastTopUps: Object.keys(this.state.lastTopUp).length,
      lastWithdrawals: Object.keys(this.state.lastWithdrawal).length
    };
  }
}

module.exports = new EconomicIsolationCore();
