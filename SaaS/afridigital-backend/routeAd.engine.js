function routeAd(user) {
  const behavior = user.economyProfile || {};

  if ((behavior.stackRatio || 0) > 0.7) {
    return {
      mode: "HIGH_VALUE_DIRECT_SPONSOR",
      split: "100% advertiser funded",
      reason: "High liquidity holder surface"
    };
  }

  if ((behavior.spendRatio || 0) > 0.6) {
    return {
      mode: "BALANCED_SPLIT",
      split: "ads + ecosystem subsidy",
      reason: "Active economy participation"
    };
  }

  return {
    mode: "STANDARD",
    split: "normal distribution",
    reason: "Neutral behavior profile"
  };
}

module.exports = routeAd;
