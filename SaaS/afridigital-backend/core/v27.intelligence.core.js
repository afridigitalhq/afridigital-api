const { assertApiVersion } = require("../runtime/safety/api.guard");

class AfriV27IntelligenceCore {

  constructor() {

    this.profiles = new Map();

    this.market = {
      adDemand: 1.0,
      liquidityHeat: 1.0,
      engagementIndex: 1.0
    };

    this.fraudLimit = 0.7;
  }

  /**
   * 🧠 BUILD USER ECONOMY PROFILE
   */
  profileUser(user, signals) {

    let p = this.profiles.get(user.id) || {
      engagement: 0,
      spending: 0,
      stacking: 0,
      adAffinity: 1
    };

    if (signals.adClick) p.engagement += 1;
    if (signals.watchTime > 5) p.engagement += 0.5;
    if (signals.internalSpend) p.spending += 1;
    if (signals.africoinHold) p.stacking += 1;

    p.adAffinity = p.engagement / (p.stacking + 1);

    this.profiles.set(user.id, p);

    return p;
  }

  /**
   * 📢 AD RANKING ENGINE (INTERNAL ONLY)
   */
  rankAds(user, ads) {

    const profile = this.profiles.get(user.id);

    return ads.sort((a, b) => {

      const scoreA = a.baseScore * (profile?.adAffinity || 1);
      const scoreB = b.baseScore * (profile?.adAffinity || 1);

      return scoreB - scoreA;
    });
  }

  /**
   * 🛡️ FRAUD DETECTION CORE
   */
  detectFraud(activity) {

    let score = 0;

    if (activity.spamClick) score += 0.4;
    if (activity.botPattern) score += 0.3;
    if (activity.instantBurst) score += 0.3;

    return Math.min(score, 1);
  }

  /**
   * 📈 INTERNAL ECONOMY FORECAST
   */
  forecast() {

    let totalEngagement = 0;

    for (let [, p] of this.profiles) {
      totalEngagement += p.engagement;
    }

    const avg = totalEngagement / (this.profiles.size || 1);

    return {
      adPressure: avg * this.market.adDemand,
      economyHeat: this.market.engagementIndex,
      liquidityStress: this.market.liquidityHeat
    };
  }

  /**
   * 🚫 PAYSTACK HARD ISOLATION
   */
  static PAYSTACK_LOCK = {
    allowed: ["TOP_UP", "WITHDRAWAL"],
    forbidden: [
      "AD_SYSTEM",
      "RANKING",
      "PRICING",
      "FORECASTING",
      "FRAUD_MODEL"
    ]
  };
}

module.exports = AfriV27IntelligenceCore;

