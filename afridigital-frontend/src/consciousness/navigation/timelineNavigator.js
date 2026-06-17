export function buildTimelineNavigator(multiverse) {
  const map = multiverse.multiverse.map((m, index) => ({
    id: index,
    name: m.branch,
    stability: m.summary.riskLevel,
    avgLatency: m.summary.avgLatency
  }));

  return {
    timelineMap: map,
    currentView: "INFINITE_BRANCH_SPACE",
    navigationMode: "TIME_REALITY_JUMP",
    hints: map
      .filter(m => m.stability === "LOW")
      .map(m => m.name)
  };
}
