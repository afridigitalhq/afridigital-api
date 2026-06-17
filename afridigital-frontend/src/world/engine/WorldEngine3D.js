import * as THREE from "three";

export function createWorld(container, data) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#02030a");

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );

  camera.position.z = 1200;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // GLOBAL SYSTEM OBJECTS
  const nodes = [];

  data.nodes.forEach((n, i) => {
    const geometry = new THREE.BoxGeometry(20, 20, 20);

    const color =
      n.risk > 0.7 ? 0xff2d2d :
      n.risk > 0.4 ? 0xffa500 :
      0x00c2ff;

    const material = new THREE.MeshBasicMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(
      Math.random() * 800 - 400,
      Math.random() * 800 - 400,
      Math.random() * 800 - 400
    );

    scene.add(cube);
    nodes.push(cube);
  });

  function animate() {
    requestAnimationFrame(animate);

    nodes.forEach(n => {
      n.rotation.x += 0.005;
      n.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
  }

  animate();
}
