
const AlertBus = require("../alerts/v27.finance.alert.bus");
const PaystackGuard = require("../policy/v28.paystack.isolation.guard");

class AnomalyShield {

  constructor() {

    this.riskProfiles = new Map();
    this.freezeList = new Set();

    this.thresholds = {
      rapidTopUp: 5,        // multiple deposits in short time
      rapidWithdrawal: 3,    // repeated cashouts
      stackSpike: 0.85,      // extreme hoarding behavior
      spendCollapse: 0.1     // sudden inactivity
    };
  }

  /**
   * 🧠 PROFILE UPDATE
   */
  updateProfile(userId, event) {

    if (!this.riskProfiles.has(userId)) {
      this.riskProfiles.set(userId, {
        topups: 0,
        withdrawals: 0,
        stackRatio: 0,
        spendRatio: 0,
        lastEvents: []
      });
    }

    const profile = this.riskProfiles.get(userId);

    profile.lastEvents.push({
      type: event.type,
      time: Date.now()
    });

    // keep only last 10 events
    profile.lastEvents = profile.lastEvents.slice(-10);

    if (event.type === "TOP_UP") profile.topups++;
    if (event.type === "WITHDRAWAL") profile.withdrawals++;

    return profile;
  }

  /**
   * 🚨 ANOMALY DETECTION CORE
   */
  detect(userId, event) {

    const p = this.updateProfile(userId, event);

    const recentTopups = p.lastEvents.filter(e => e.type === "TOP_UP").length;
    const recentWithdrawals = p.lastEvents.filter(e => e.type === "WITHDRAWAL").length;

    let riskScore = 0;

    if (recentTopups >= this.thresholds.rapidTopUp) riskScore += 40;
    if (recentWithdrawals >= this.thresholds.rapidWithdrawal) riskScore += 40;
    if (p.stackRatio > this.thresholds.stackSpike) riskScore += 25;
    if (p.spendRatio < this.thresholds.spendCollapse) riskScore += 15;

    return { riskScore, profile: p };
  }

  /**
   * 🔒 ACTION ENGINE
   */
  async enforce(userId, event) {

    const { riskScore, profile } = this.detect(userId, event);

    if (riskScore >= 80) {

      this.freezeList.add(userId);

      await AlertBus.dispatch({
        type: "ACCOUNT_FROZEN",
        userId,
        riskScore,
        reason: "HIGH FINANCIAL ANOMALY DETECTED"
      });

      return {
        status: "FROZEN",
        action: "BLOCK_ALL_FINANCIAL_ACTIVITY"
      };
    }

    if (riskScore >= 50) {

      await AlertBus.dispatch({
        type: "RISK_WARNING",
        userId,
        riskScore,
        reason: "SUSPICIOUS FINANCIAL BEHAVIOR"
      });

      return {
        status: "MONITORING",
        action: "LIMITED_THROTTLE"
      };
    }

    return {
      status: "CLEAR",
      action: "ALLOW"
    };
  }

  /**
   * 📊 SYSTEM HEALTH VIEW
   */
  snapshot() {
    return {
      frozenAccounts: this.freezeList.size,
      monitoredUsers: this.riskProfiles.size
    };
  }
}

module.exports = new AnomalyShield();
