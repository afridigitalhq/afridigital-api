export function forecastRevenue(metrics) {
  const baseRevenue = metrics.revenue || 0;
  const users = metrics.users || 1;
  const conversionRate = metrics.conversionRate || 0.01;

  const projectedUsers30d = users * 1.25;
  const projectedUsers90d = users * 1.8;

  const projectedRevenue30d = baseRevenue * 1.3 * (conversionRate + 0.002);
  const projectedRevenue90d = baseRevenue * 1.9 * (conversionRate + 0.005);

  return {
    current: {
      revenue: baseRevenue,
      users
    },
    forecast: {
      "30d": {
        users: projectedUsers30d,
        revenue: projectedRevenue30d
      },
      "90d": {
        users: projectedUsers90d,
        revenue: projectedRevenue90d
      }
    },
    mode: "PREDICTIVE_BI_MODEL"
  };
}
