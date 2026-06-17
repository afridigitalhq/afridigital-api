export function optimizeLayout(nodes, edges) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  return nodes.map((n, i) => {
    const angle = (i / nodes.length) * Math.PI * 2;
    const radius = 200 + (n.execCount || 0) * 5;

    return {
      ...n,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  });
}
