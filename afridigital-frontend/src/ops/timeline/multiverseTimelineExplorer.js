export function exploreTimelines(baseEvents) {
  const branches = [];

  const modifiers = [
    { name: "OPTIMAL_BRANCH", factor: 0.8 },
    { name: "BASELINE_BRANCH", factor: 1.0 },
    { name: "DEGRADED_BRANCH", factor: 1.4 },
    { name: "CATASTROPHIC_BRANCH", factor: 2.0 }
  ];

  for (const m of modifiers) {
    const timeline = baseEvents.map(e => ({
      ...e,
      latency: (e.latency || 100) * m.factor,
      stability:
        m.factor > 1.7 ? "COLLAPSE_ZONE" :
        m.factor > 1.2 ? "DEGRADED_ZONE" :
        "STABLE_ZONE"
    }));

    branches.push({
      branch: m.name,
      timeline,
      summary: {
        avgLatency: timeline.reduce((a, b) => a + (b.latency || 0), 0) / timeline.length,
        riskLevel:
          m.factor > 1.7 ? "EXTREME" :
          m.factor > 1.2 ? "HIGH" :
          "LOW"
      }
    });
  }

  return {
    multiverse: branches,
    mode: "INFINITE_TIMELINE_NAVIGATION"
  };
}
