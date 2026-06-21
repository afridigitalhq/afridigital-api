export function computeForces(nodes, edges) {
  const k = 0.08;

  const updated = nodes.map(n => {
    let fx = 0;
    let fy = 0;

    for (const m of nodes) {
      if (n.id === m.id) continue;

      const dx = n.x - m.x;
      const dy = n.y - m.y;
      const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));

      // repulsion
      fx += (dx / dist) * k;
      fy += (dy / dist) * k;
    }

    // mild centering force
    fx += (0 - n.x) * 0.001;
    fy += (0 - n.y) * 0.001;

    return {
      ...n,
      x: n.x - fx,
      y: n.y - fy
    };
  });

  return updated;
}
