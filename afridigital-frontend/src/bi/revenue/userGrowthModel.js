export function predictUserGrowth(metrics) {
  const active = metrics.activeUsers || 0;
  const retention = metrics.retentionRate || 0.5;

  const growthVelocity = active * retention;

  return {
    currentActive: active,
    retention,
    projectedGrowth: {
      weekly: growthVelocity * 7,
      monthly: growthVelocity * 30
    },
    mode: "USER_GROWTH_FORECAST"
  };
}
