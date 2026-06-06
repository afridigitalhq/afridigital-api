function predictGrowth(data) {
  const trends = {};

  (data.jobs || []).forEach(j => {
    trends[j.category] = (trends[j.category] || { jobs: 0, earnings: 0 });
    trends[j.category].jobs += 1;
    trends[j.category].earnings += j.earnings || 0;
  });

  const forecast = Object.entries(trends).map(([category, v]) => {
    const growthScore = (v.jobs * 0.7) + (v.earnings * 0.3);

    return {
      category,
      jobs: v.jobs,
      earnings: v.earnings,
      predictedGrowth: Math.round(growthScore * 1.2),
      trend: growthScore > 10 ? "UPWARD" : "STABLE"
    };
  });

  return {
    ok: true,
    forecast,
    note: "SAFE_FORECAST_ONLY_NO_ACTION_TAKEN"
  };
}

module.exports = { predictGrowth };
