import * as THREE from "three";

export function buildOpsMetaverse(container, system) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#01040a");

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    8000
  );

  camera.position.set(0, 500, 1400);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const entities = [];

  system.nodes.forEach((n) => {
    const geometry = new THREE.OctahedronGeometry(25);

    const color =
      n.role === "REVENUE" ? 0x00ff88 :
      n.role === "AI" ? 0x00c2ff :
      n.risk > 0.7 ? 0xff3b3b :
      0xffaa00;

    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(
      Math.random() * 1000 - 500,
      Math.random() * 600 - 300,
      Math.random() * 1000 - 500
    );

    scene.add(mesh);
    entities.push(mesh);
  });

  function animate() {
    requestAnimationFrame(animate);

    entities.forEach((e) => {
      e.rotation.x += 0.003;
      e.rotation.y += 0.006;
    });

    renderer.render(scene, camera);
  }

  animate();
}
