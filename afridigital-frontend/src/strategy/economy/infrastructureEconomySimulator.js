export function simulateEconomy(state) {
  const infraCost = state.infrastructureCost || 0;
  const users = state.users || 1;
  const revenuePerUser = state.revenuePerUser || 1;

  const revenue = users * revenuePerUser;

  const scalingEffect = users > 1000 ? 0.85 : 1.0;
  const costScaling = infraCost * Math.log(users + 1);

  const net = revenue * scalingEffect - costScaling;

  const efficiency = revenue / (costScaling || 1);

  const growthPotential =
    efficiency > 2
      ? "HIGH_EXPANSION_ZONE"
      : efficiency > 1
      ? "STABLE_GROWTH"
      : "LOSS_RISK_ZONE";

  return {
    revenue,
    cost: costScaling,
    net,
    efficiency,
    growthPotential,
    mode: "SELF_OPTIMIZING_DIGITAL_ECONOMY_MODEL"
  };
}
