export function mapRegions(data = []) {
  return data.map(region => ({
    region: region.name,
    nodes: region.nodes.length,
    latency: region.latency,
    status:
      region.latency < 100 ? "FAST" :
      region.latency < 300 ? "OK" :
      "SLOW"
  }));
}
