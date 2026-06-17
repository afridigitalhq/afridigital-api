export function buildFederationState(regions) {
  const globalNodes = {};
  const regionMap = {};

  for (const region of regions) {
    regionMap[region.id] = {
      latency: region.latency,
      nodes: region.nodes.length,
      status: region.status
    };

    region.nodes.forEach(n => {
      globalNodes[n.id] = {
        ...n,
        region: region.id
      };
    });
  }

  return {
    regions: regionMap,
    globalNodeCount: Object.keys(globalNodes).length,
    nodes: globalNodes,
    health:
      regions.every(r => r.status === "OK") ? "STABLE" : "DEGRADED"
  };
}
