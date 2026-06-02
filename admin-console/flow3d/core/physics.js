export function updatePhysics(nodes, edges) {
  const center = { x: 0, y: 0, z: 0 };

  nodes.forEach((n) => {
    if (!n.pos) {
      n.pos = {
        x: Math.random() * 10 - 5,
        y: Math.random() * 10 - 5,
        z: Math.random() * 10 - 5
      };
    }

    // attraction to center (stability field)
    n.pos.x += (center.x - n.pos.x) * 0.001;
    n.pos.y += (center.y - n.pos.y) * 0.001;
    n.pos.z += (center.z - n.pos.z) * 0.001;

    // pulse affects drift
    const force = (n.load || 0.5) * 0.02;

    n.pos.x += (Math.random() - 0.5) * force;
    n.pos.y += (Math.random() - 0.5) * force;
    n.pos.z += (Math.random() - 0.5) * force;
  });

  // edge tension (keep graph connected)
  edges.forEach((e) => {
    const a = nodes.find(n => n.id === e.from);
    const b = nodes.find(n => n.id === e.to);

    if (!a || !b) return;

    const dx = a.pos.x - b.pos.x;
    const dy = a.pos.y - b.pos.y;
    const dz = a.pos.z - b.pos.z;

    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz) + 0.001;

    const pull = (e.weight || 0.5) * 0.01;

    a.pos.x -= dx / dist * pull;
    a.pos.y -= dy / dist * pull;
    a.pos.z -= dz / dist * pull;

    b.pos.x += dx / dist * pull;
    b.pos.y += dy / dist * pull;
    b.pos.z += dz / dist * pull;
  });

  return nodes;
}
