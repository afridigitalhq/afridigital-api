export function computeHeat(nodes) {
  const heat = new Map();

  nodes.forEach(n => {
    const intensity =
      (n.execCount || 1) *
      (n.errorCount ? 2 : 1);

    heat.set(n.id, Math.min(intensity, 10));
  });

  return heat;
}
