import * as THREE from "three";

export function createTemporalGraph(container, data) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#05060a");

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000);
  camera.position.z = 800;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const nodes = [];

  data.nodes.forEach((n, i) => {
    const geo = new THREE.SphereGeometry(6, 12, 12);
    const mat = new THREE.MeshBasicMaterial({
      color:
        n.risk > 0.7 ? 0xff3b3b :
        n.risk > 0.4 ? 0xffa500 :
        0x00c2ff
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(Math.random()*400, Math.random()*400, Math.random()*400);

    scene.add(mesh);
    nodes.push(mesh);
  });

  function animate() {
    requestAnimationFrame(animate);

    nodes.forEach(n => {
      n.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
  }

  animate();
}
