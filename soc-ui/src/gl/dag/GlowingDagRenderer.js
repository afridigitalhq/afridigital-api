import * as THREE from "three";
import { forceSimulation, forceManyBody, forceLink, forceCenter } from "d3-force";

export class GlowingDagRenderer {
  constructor(container) {
    this.container = container;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(this.renderer.domElement);

    this.nodes = [];
    this.links = [];

    this.sim = forceSimulation()
      .force("charge", forceManyBody().strength(-100))
      .force("link", forceLink().id(d => d.id).distance(90))
      .force("center", forceCenter(0, 0));

    this.camera.position.z = 350;
  }

  load(graph) {
    this.nodes = graph.nodes;
    this.links = graph.edges;

    this.sim.nodes(this.nodes)
      .force("link").links(this.links);

    this.sim.on("tick", () => this.render());
  }

  render() {
    this.scene.clear();

    const nodeGeo = new THREE.SphereGeometry(4, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });

    for (const n of this.nodes) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.position.x = n.x;
      mesh.position.y = n.y;
      this.scene.add(mesh);
    }

    const lineMat = new THREE.LineBasicMaterial({ color: 0x4444ff });

    for (const e of this.links) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(e.source.x, e.source.y, 0),
        new THREE.Vector3(e.target.x, e.target.y, 0)
      ]);

      this.scene.add(new THREE.Line(geo, lineMat));
    }

    this.renderer.render(this.scene, this.camera);
  }
}
