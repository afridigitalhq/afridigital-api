const THREE = require('three');

class FlowGraph3DRenderer {
  constructor() {
    this.nodes = new Map();
    this.links = [];

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      1,
      0.1,
      1000
    );

    this.camera.position.z = 80;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(800, 600);

    this.nodeObjects = new Map();
  }

  start() {
    console.log("🌐 FLOWGRAPH 3D VISUAL CORTEX STARTED (READ-ONLY)");
    this.animate();
  }

  ingest(event) {
    const id = event.traceId || "unknown";

    if (!this.nodes.has(id)) {
      this.nodes.set(id, {
        id,
        type: event.type,
        energy: 1
      });

      const geometry = new THREE.SphereGeometry(1, 12, 12);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = Math.random() * 40 - 20;
      mesh.position.y = Math.random() * 40 - 20;
      mesh.position.z = Math.random() * 40 - 20;

      this.scene.add(mesh);
      this.nodeObjects.set(id, mesh);
    }

    this.links.push(event);
  }

  updatePhysics() {
    // simple force-directed layout (visual only)
    const nodes = Array.from(this.nodeObjects.values());

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];

        const dx = a.position.x - b.position.x;
        const dy = a.position.y - b.position.y;
        const dz = a.position.z - b.position.z;

        const dist = Math.max(1, Math.sqrt(dx*dx + dy*dy + dz*dz));

        const force = 0.01;

        a.position.x += dx / dist * force;
        a.position.y += dy / dist * force;
        a.position.z += dz / dist * force;

        b.position.x -= dx / dist * force;
        b.position.y -= dy / dist * force;
        b.position.z -= dz / dist * force;
      }
    }
  }

  animate() {
    this.updatePhysics();

    this.renderer.render(this.scene, this.camera);

    setTimeout(() => this.animate(), 16);
  }
}

module.exports = FlowGraph3DRenderer;
