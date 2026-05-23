function computeRevenueObjective({ intentScore, conversionProb, lifetimeValue, urgency }) {

  const score =
    (intentScore * 0.25) +
    (conversionProb * 0.40) +
    (lifetimeValue * 0.25) +
    (urgency * 0.10);

  return Math.min(score, 1);
}

function expectedRevenue(score, baseValue = 100) {
  return score * baseValue;
}

module.exports = {
  computeRevenueObjective,
  expectedRevenue
};
