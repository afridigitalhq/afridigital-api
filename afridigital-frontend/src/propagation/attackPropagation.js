export function propagate(nodes = [], edges = []) {
  const influence = new Map();

  // initialize heat
  for (const n of nodes) {
    influence.set(n.id, {
      heat: n.physics?.heat || 0,
      velocity: n.physics?.velocity || 1
    });
  }

  // propagate along edges
  for (const e of edges) {
    const a = influence.get(e.source);
    const b = influence.get(e.target);

    if (!a || !b) continue;

    const transfer = a.heat * 0.15;

    b.heat += transfer;
    a.heat *= 0.85;
  }

  return nodes.map(n => ({
    ...n,
    propagation: influence.get(n.id) || { heat: 0, velocity: 1 }
  }));
}
