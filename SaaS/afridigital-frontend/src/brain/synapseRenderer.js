import * as THREE from "three";

export function renderSynapses(scene, edges, nodes) {
  const material = new THREE.LineBasicMaterial({ color: 0x00ffcc });

  edges.forEach(edge => {
    const from = nodes[edge.fromIndex % nodes.length];
    const to = nodes[edge.toIndex % nodes.length];

    if (!from || !to) return;

    const geometry = new THREE.BufferGeometry().setFromPoints([
      from.position,
      to.position
    ]);

    const line = new THREE.Line(geometry, material);

    // weight → thickness simulation
    line.scale.setScalar(Math.max(0.5, edge.weight));

    scene.add(line);
  });
}
