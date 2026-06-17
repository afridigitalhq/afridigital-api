import * as THREE from "three";

export function createOpsMetaverse(container, systemState) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#02030a");

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );

  camera.position.set(0, 400, 1200);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const objects = [];

  systemState.nodes.forEach((n) => {
    const geometry = new THREE.IcosahedronGeometry(20, 0);

    const color =
      n.type === "PAYMENT" ? 0x00ff88 :
      n.type === "AI" ? 0x00c2ff :
      n.risk > 0.7 ? 0xff3b3b :
      0xffa500;

    const material = new THREE.MeshBasicMaterial({ color });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(
      Math.random() * 800 - 400,
      Math.random() * 500 - 250,
      Math.random() * 800 - 400
    );

    scene.add(mesh);
    objects.push(mesh);
  });

  function animate() {
    requestAnimationFrame(animate);

    objects.forEach((o) => {
      o.rotation.x += 0.004;
      o.rotation.y += 0.006;
    });

    renderer.render(scene, camera);
  }

  animate();
}
