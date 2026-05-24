function computePrice(basePrice, revenueScore, churnScore) {

  let multiplier = 1;

  // high intent = higher conversion value
  if (revenueScore > 0.7) multiplier += 0.2;

  // high churn risk = discount incentive
  if (churnScore > 0.6) multiplier -= 0.25;

  const final = basePrice * multiplier;

  return Math.max(basePrice * 0.5, final); // floor protection
}

module.exports = { computePrice };
