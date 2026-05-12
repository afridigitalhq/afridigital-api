const { assertApiVersion } = require("../runtime/safety/api.guard");
class AfriV26PricingOptimizer {

  constructor() {

    this.segmentScores = {
      STACKERS: { reward: 1.0, bidMultiplier: 1.0 },
      SPENDERS: { reward: 1.0, bidMultiplier: 1.0 },
      ACTIVE: { reward: 1.0, bidMultiplier: 1.0 },
      LOW_ACTIVITY: { reward: 1.0, bidMultiplier: 1.0 }
    };

    this.learningRate = 0.05;
    this.decay = 0.98;
  }

  /**
   * 🧠 USER SEGMENT CLASSIFIER
   */
  classify(user) {

    const p = user.economyProfile || {};

    if (p.stackRatio > 0.7) return "STACKERS";
    if (p.spendRatio > 0.6) return "SPENDERS";
    if ((user.engagementScore || 0) > 0.7) return "ACTIVE";

    return "LOW_ACTIVITY";
  }

  /**
   * 💰 MULTIPLIER FETCH
   */
  getMultiplier(user) {

    const segment = this.classify(user);

    return this.segmentScores[segment].bidMultiplier;
  }

  /**
   * 📈 SELF-LEARNING CORE (FIXED)
   */
  learn(user, outcome) {

    const segment = this.classify(user);
    const score = this.segmentScores[segment];

    // 🎯 reward signal
    let reward = 0;

    if (outcome.clicked) reward += 1;
    if (outcome.converted) reward += 3;
    if ((outcome.timeSpent || 0) > 5) reward += 0.5;

    // 📊 moving average update (FIXED SAFE FORMULA)
    score.reward =
      (score.reward * this.decay) +
      (reward * this.learningRate);

    // 📈 pricing adjustment logic
    const performanceDelta = reward - score.reward;

    if (performanceDelta > 0) {
      score.bidMultiplier *= (1 + this.learningRate);
    } else {
      score.bidMultiplier *= (1 - this.learningRate * 0.5);
    }

    // 🛡️ safety clamps (critical for production stability)
    score.bidMultiplier = Math.max(0.5, Math.min(score.bidMultiplier, 3.0));
  }

  /**
   * 📊 SYSTEM INSIGHTS
   */
  getInsights() {
    return {
      segments: this.segmentScores,
      learningRate: this.learningRate,
      decay: this.decay
    };
  }
}

module.exports = AfriV26PricingOptimizer;
