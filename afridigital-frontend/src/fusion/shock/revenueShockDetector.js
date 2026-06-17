export function detectRevenueShock(history) {
  if (!history || history.length < 3) {
    return { status: "INSUFFICIENT_DATA" };
  }

  const recent = history.slice(-5);
  const avg =
    recent.reduce((a, b) => a + b.revenue, 0) / recent.length;

  const previous = history.slice(-10, -5);
  const prevAvg =
    previous.length
      ? previous.reduce((a, b) => a + b.revenue, 0) / previous.length
      : avg;

  const drop = (prevAvg - avg) / (prevAvg || 1);

  return {
    currentAverage: avg,
    previousAverage: prevAvg,
    shockIndex: drop,
    status:
      drop > 0.4
        ? "REVENUE_COLLAPSE_ALERT"
        : drop > 0.2
        ? "REVENUE_VOLATILITY"
        : "STABLE",
    mode: "REAL_TIME_SHOCK_DETECTION"
  };
}
