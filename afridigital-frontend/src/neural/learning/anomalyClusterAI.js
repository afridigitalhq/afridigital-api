export function clusterAnomalies(events) {
  const clusters = {};

  for (const e of events) {
    const key =
      e.type === "FAILURE" && e.latency > 500
        ? "HIGH_LATENCY_FAILURE"
        : e.type === "FAILURE"
        ? "GENERIC_FAILURE"
        : "NORMAL_BEHAVIOR";

    if (!clusters[key]) {
      clusters[key] = {
        count: 0,
        nodes: new Set()
      };
    }

    clusters[key].count++;
    clusters[key].nodes.add(e.node);
  }

  return {
    clusters: Object.entries(clusters).map(([k, v]) => ({
      cluster: k,
      frequency: v.count,
      affectedNodes: Array.from(v.nodes),
      severity:
        v.count > 10 ? "HIGH" :
        v.count > 5 ? "MEDIUM" : "LOW"
    })),
    mode: "SELF_LEARNING_ANOMALY_GROUPING"
  };
}
