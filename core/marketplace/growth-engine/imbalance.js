function detectImbalance(demand, supply) {

  const insights = [];

  const keys = new Set([
    ...Object.keys(demand),
    ...Object.keys(supply)
  ]);

  keys.forEach(k => {

    const d = demand[k] || 0;
    const s = supply[k] || 0;

    const gap = d - s;

    if (gap > 2) {
      insights.push({
        category: k,
        type: "UNDER_SUPPLIED",
        gap
      });
    }

    if (gap < -2) {
      insights.push({
        category: k,
        type: "OVER_SUPPLIED",
        gap
      });
    }
  });

  return insights;
}
