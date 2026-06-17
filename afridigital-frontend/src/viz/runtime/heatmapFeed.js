export function buildHeatmap(regions = []) {
  return regions.map(r => ({
    name: r.name,
    load: r.nodes?.length || 0,
    latency: r.latency || 0,
    intensity: (r.nodes?.length || 1) * (r.latency || 1)
  }));
}
