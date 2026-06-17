export function federateGraph(liveGraph) {
  const regions = ["AFRICA", "EUROPE", "GLOBAL"];

  const federated = {};

  regions.forEach(region => {
    federated[region] = {
      nodes: [],
      edges: [],
      lag: Math.random() * 200
    };
  });

  for (const node of liveGraph.nodes.values()) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    federated[region].nodes.push({
      ...node,
      region
    });
  }

  liveGraph.edges.forEach(e => {
    const region = regions[Math.floor(Math.random() * regions.length)];
    federated[region].edges.push({
      ...e,
      region
    });
  });

  return federated;
}
