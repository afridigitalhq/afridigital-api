import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class FlowGraphEngine {
  constructor(container) {
    this.container = container;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 2000);
    this.camera.position.z = 120;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.nodes = new Map();
    this.nodeMeshes = new Map();

    this.clock = new THREE.Clock();

    this.animate = this.animate.bind(this);
    this.animate();
  }

  ingest(event) {
    const id = event.traceId || "unknown";

    if (!this.nodes.has(id)) {
      this.nodes.set(id, { id, energy: 1 });

      const geo = new THREE.SphereGeometry(1.5, 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff });

      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80
      );

      this.scene.add(mesh);
      this.nodeMeshes.set(id, mesh);
    }

    const node = this.nodes.get(id);
    node.energy += 0.2;

    const mesh = this.nodeMeshes.get(id);
    mesh.scale.setScalar(1 + node.energy * 0.1);
  }

  physicsStep() {
    const meshes = Array.from(this.nodeMeshes.values());

    for (let i = 0; i < meshes.length; i++) {
      for (let j = i + 1; j < meshes.length; j++) {
        const a = meshes[i];
        const b = meshes[j];

        const dx = a.position.x - b.position.x;
        const dy = a.position.y - b.position.y;
        const dz = a.position.z - b.position.z;

        const dist = Math.max(1, Math.sqrt(dx*dx + dy*dy + dz*dz));
        const force = 0.03;

        a.position.x += (dx / dist) * force;
        a.position.y += (dy / dist) * force;
        a.position.z += (dz / dist) * force;

        b.position.x -= (dx / dist) * force;
        b.position.y -= (dy / dist) * force;
        b.position.z -= (dz / dist) * force;
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.physicsStep();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

import { TimeTravel } from "./timeline/timeTravel";
import { CausalEngine } from "./causal/causalEngine";

this.time = new TimeTravel();
this.causal = new CausalEngine();

/**
 * Enhanced ingest (visual only)
 */
const originalIngest = this.ingest.bind(this);

this.ingest = (event) => {
  // record timeline
  this.time.record(event);

  // record causal metadata
  this.causal.record(event);

  // normal visualization
  originalIngest(event);
};

/**
 * Explain node (click handler hook)
 */
this.explainNode = (traceId) => {
  return this.causal.explain(traceId);
};

/**
 * replay timeline (visual mode only)
 */
this.replay = (from, to) => {
  const events = this.time.replay(from, to);

  this.nodes.clear();
  this.nodeMeshes.forEach(m => this.scene.remove(m));
  this.nodeMeshes.clear();

  for (const e of events) {
    originalIngest(e.event);
  }
};
