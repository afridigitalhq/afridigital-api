import * as THREE from "three";

export default function AfriBrainCortex(canvas, socketUrl) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.z = 40;

  // 🌐 neural nodes
  const nodes = [];
  const geometry = new THREE.SphereGeometry(0.6, 16, 16);

  const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });

  for (let i = 0; i < 80; i++) {
    const node = new THREE.Mesh(geometry, material.clone());

    node.position.x = (Math.random() - 0.5) * 40;
    node.position.y = (Math.random() - 0.5) * 40;
    node.position.z = (Math.random() - 0.5) * 40;

    node.userData = { heat: 0 };
    scene.add(node);
    nodes.push(node);
  }

  // 🌐 connections (neural edges)
  const linesMaterial = new THREE.LineBasicMaterial({ color: 0x2222ff });
  const lines = new THREE.Group();
  scene.add(lines);

  function pulse(nodeIndex) {
    const node = nodes[nodeIndex % nodes.length];
    node.userData.heat = 1.0;
  }

  // 🌐 WebSocket stream
  const socket = new WebSocket(socketUrl);

  socket.onmessage = (msg) => {
    try {
      const event = JSON.parse(msg.data);

      const index = Math.abs(
        event.payload?.timestamp || Date.now()
      ) % nodes.length;

      pulse(index);
    } catch (e) {}
  };

  // 🔥 heat diffusion
  function updateHeat() {
    nodes.forEach((n) => {
      n.userData.heat *= 0.92;

      const h = n.userData.heat;

      n.material.color.setRGB(0, h, 1);

      n.scale.set(1 + h * 2, 1 + h * 2, 1 + h * 2);
    });
  }

  // 🧠 animation loop
  function animate() {
    requestAnimationFrame(animate);

    scene.rotation.y += 0.002;
    scene.rotation.x += 0.001;

    updateHeat();

    renderer.render(scene, camera);
  }

  animate();

  return { scene, camera, renderer };
}
