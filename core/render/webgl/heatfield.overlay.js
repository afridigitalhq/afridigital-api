function computeHeatField(nodes) {
  return nodes.map(n => ({
    id: n.id,
    heat: (n.physics?.heat || 0),
    decay: n.decay || 0.95,
    velocity: n.physics?.velocity || 1
  }));
}

module.exports = { computeHeatField };
