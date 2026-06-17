export function simulateGlobalFailure(regions) {
  const impactMap = {};

  regions.forEach(r => {
    impactMap[r.id] = {
      state: r.status,
      vulnerability: r.load * 0.1,
      spreadRisk: 0
    };
  });

  // propagate failure risk across regions
  regions.forEach(r => {
    const baseRisk = r.status === "DEGRADED" ? 0.6 : 0.2;

    (r.connections || []).forEach(target => {
      if (impactMap[target]) {
        impactMap[target].spreadRisk += baseRisk * 0.7;
      }
    });
  });

  const result = Object.entries(impactMap).map(([id, v]) => ({
    region: id,
    collapseRisk: Math.min(1, v.spreadRisk + v.vulnerability),
    state: v.state
  }));

  return {
    globalModel: result,
    systemStability:
      result.some(r => r.collapseRisk > 0.8)
        ? "GLOBAL_UNSTABLE"
        : "STABLE",
    mode: "GLOBAL_PROPAGATION_SIMULATION"
  };
}
