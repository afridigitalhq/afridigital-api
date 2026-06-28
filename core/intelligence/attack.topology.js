const { getEvents } = require("../event-engine/engine");

function buildTopology(events) {
  const nodes = new Map();
  const edges = [];

  // 1. Normalize nodes
  for (const e of events) {
    nodes.set(e.id, {
      id: e.id,
      type: e.type,
      service: e.service,
      score: e.score || 0,
      heat: e.physics?.heat || 0,
      ts: new Date(e.ts).getTime()
    });
  }

  const list = Array.from(nodes.values());

  // 2. Infer propagation edges
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i];
      const b = list[j];

      const timeDelta = Math.abs(a.ts - b.ts);
      const sameService = a.service === b.service;
      const heatDiff = Math.abs(a.heat - b.heat);

      const propagationScore =
        (sameService ? 3 : 0) +
        (timeDelta < 5000 ? 3 : 0) +
        (heatDiff < 20 ? 2 : 0) +
        (b.score > a.score ? 2 : 0);

      if (propagationScore >= 6) {
        edges.push({
          from: a.id,
          to: b.id,
          weight: propagationScore
        });
      }
    }
  }

  return {
    nodes: list,
    edges
  };
}

function detectRootCauses(graph) {
  const inbound = new Map();

  for (const e of graph.edges) {
    inbound.set(e.to, (inbound.get(e.to) || 0) + 1);
  }

  return graph.nodes
    .map(n => ({
      ...n,
      inbound: inbound.get(n.id) || 0
    }))
    .sort((a, b) => a.inbound - b.inbound)
    .slice(0, 5); // strongest root candidates
}

function getAttackTopology() {
  const events = getEvents(200);
  const graph = buildTopology(events);

  return {
    graph,
    roots: detectRootCauses(graph),
    timestamp: Date.now()
  };
}

module.exports = { getAttackTopology };
