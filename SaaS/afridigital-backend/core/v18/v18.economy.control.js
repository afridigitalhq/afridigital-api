const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AFRIDIGITAL V18 ECONOMY CONTROL ENGINE
 * - KYC-gated withdrawals (after first withdrawal)
 * - Premium subscription system
 * - Tier-based daily rewards
 */

class AfriV18EconomyControl {

  constructor(config = {}) {
    this.premiumCostNaira = config.premiumCostNaira || 3000;
    this.premiumCostAfricoin = config.premiumCostAfricoin || 30000;

    this.basicReward = config.basicReward || 10;
    this.premiumReward = config.premiumReward || 15;
  }

  /**
   * 🎁 DAILY CHECK-IN REWARD SYSTEM
   */
  processCheckIn(user) {

    const reward = user.isPremium
      ? this.premiumReward
      : this.basicReward;

    user.wallet.africoin += reward;

    return {
      status: "REWARDED",
      reward,
      newBalance: user.wallet.africoin
    };
  }

  /**
   * 🔐 WITHDRAWAL ACCESS CONTROL
   */
  canWithdraw(user) {

    // First withdrawal allowed
    if (!user.hasWithdrawnBefore) {
      return { allowed: true, kycRequired: false };
    }

    // After first withdrawal → KYC required
    if (!user.kycVerified) {
      return {
        allowed: false,
        message: "Complete KYC (NIN/BVN) to continue withdrawals"
      };
    }

    return { allowed: true, kycRequired: true };
  }

  /**
   * 💎 PREMIUM UPGRADE SYSTEM
   */
  upgradeToPremium(user, method = "AFRICOIN") {

    if (method === "NAIRA") {

      if (user.wallet.native < this.premiumCostNaira) {
        return { status: "FAILED", message: "Insufficient balance" };
      }

      user.wallet.native -= this.premiumCostNaira;
    }

    if (method === "AFRICOIN") {

      if (user.wallet.africoin < this.premiumCostAfricoin) {
        return { status: "FAILED", message: "Insufficient Africoin" };
      }

      user.wallet.africoin -= this.premiumCostAfricoin;
    }

    user.isPremium = true;

    return {
      status: "UPGRADED",
      tier: "PREMIUM",
      rewardBoost: this.premiumReward
    };
  }

  /**
   * 🧠 KYC ENFORCEMENT MESSAGE ENGINE
   */
  kycReminder(user) {

    if (user.hasWithdrawnBefore && !user.kycVerified) {

      return `
📢 Withdrawal Security Update

To continue withdrawing funds, please complete KYC verification.

🔐 Required: NIN / BVN

⚠️ This protects your account and ensures secure payouts.
`;
    }

    return null;
  }

  /**
   * 💰 PREMIUM STATUS CHECK
   */
  getUserTier(user) {

    return {
      tier: user.isPremium ? "PREMIUM" : "BASIC",
      dailyReward: user.isPremium ? this.premiumReward : this.basicReward
    };
  }
}

module.exports = AfriV18EconomyControl;
