export function mapSystemToWorld(nodes, metrics) {
  return {
    nodes: nodes.map(n => ({
      id: n.id,
      risk: n.failureProbability || 0,
      load: metrics.load || 0,
      domain: n.domain || "UNKNOWN"
    })),
    mode: "SYSTEM_AS_SPATIAL_SIMULATION"
  };
}
