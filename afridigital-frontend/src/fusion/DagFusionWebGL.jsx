import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DagFusionWebGL({ nodes, edges, fusion }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#05060a");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 600;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const meshes = new Map();

    nodes.forEach(n => {
      const geo = new THREE.SphereGeometry(8, 16, 16);

      const risk = fusion?.nodeOverlays?.[n.id]?.risk;

      const color =
        risk === "HIGH" ? 0xff3b3b :
        risk === "MEDIUM" ? 0xffaa00 :
        0x00c2ff;

      const mat = new THREE.MeshBasicMaterial({ color });

      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(
        Math.random() * 300,
        Math.random() * 300,
        0
      );

      scene.add(mesh);
      meshes.set(n.id, mesh);
    });

    const animate = () => {
      requestAnimationFrame(animate);

      nodes.forEach(n => {
        const mesh = meshes.get(n.id);
        if (!mesh) return;

        const overlay = fusion?.nodeOverlays?.[n.id];

        mesh.material.color.set(
          overlay?.risk === "HIGH" ? "#ff3b3b" :
          overlay?.risk === "MEDIUM" ? "#ffaa00" :
          "#00c2ff"
        );
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => mountRef.current.removeChild(renderer.domElement);
  }, [nodes, edges, fusion]);

  return <div ref={mountRef} />;
}
