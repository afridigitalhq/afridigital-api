export function applyHeat(nodes, heatState) {
  nodes.forEach((node, i) => {
    const heat = heatState[i] || 0;

    // blue → cyan → white thermal shift
    node.material.color.setRGB(
      Math.min(1, heat * 0.2),
      Math.min(1, heat),
      1
    );

    node.scale.setScalar(1 + heat * 2.5);
  });
}
