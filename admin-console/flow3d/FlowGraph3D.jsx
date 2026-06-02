import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { updatePhysics } from "./core/physics";

export default function FlowGraph3D({ nodes, edges }) {
  const ref = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050814");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    ref.current.appendChild(renderer.domElement);

    // LIGHT
    const light = new THREE.PointLight(0x00ffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);

    // NODE MESHES
    const nodeMeshes = new Map();

    function createNode(n) {
      const geometry = new THREE.SphereGeometry(0.3 + (n.load || 0.5), 16, 16);
      const material = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x003333
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      nodeMeshes.set(n.id, mesh);
    }

    function animate() {
      requestAnimationFrame(animate);

      const updated = updatePhysics(nodes, edges);

      updated.forEach(n => {
        if (!nodeMeshes.has(n.id)) createNode(n);

        const m = nodeMeshes.get(n.id);
        m.position.set(n.pos.x, n.pos.y, n.pos.z);

        // pulse = glow intensity
        m.material.emissiveIntensity = n.pulse || 0.5;
      });

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      ref.current.innerHTML = "";
    };
  }, [nodes, edges]);

  return <div ref={ref} />;
}
