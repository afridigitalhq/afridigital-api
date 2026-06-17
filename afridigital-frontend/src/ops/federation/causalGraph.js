export function buildCausalGraph(regions) {
  const nodes = [];
  const edges = [];

  regions.forEach(region => {
    nodes.push({
      id: region.id,
      load: region.load || 0,
      status: region.status
    });

    if (region.dependencies) {
      region.dependencies.forEach(dep => {
        edges.push({
          from: region.id,
          to: dep,
          type: "CAUSAL_LINK"
        });
      });
    }
  });

  return {
    nodes,
    edges,
    globalHealth:
      regions.every(r => r.status === "OK")
        ? "STABLE"
        : "DEGRADED"
  };
}
