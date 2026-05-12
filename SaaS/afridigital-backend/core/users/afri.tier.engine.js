const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS V7.1 - User Tier Engine
 */

function getUserTier(user) {
  return user?.tier || "BASIC";
}

function tierLimits(tier) {
  if (tier === "PREMIUM") {
    return {
      maxDiscountStack: 25,
      rewardEligible: true,
      couponPriority: true
    };
  }

  return {
    maxDiscountStack: 15,
    rewardEligible: false,
    couponPriority: true
  };
}

module.exports = {
  getUserTier,
  tierLimits
};
