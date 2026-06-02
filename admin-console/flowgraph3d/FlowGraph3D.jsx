import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFlowGraph3D } from "./useFlowGraph3D";

/**
 * NEURAL CORTEX VISUALIZER (SAFE RENDER LAYER)
 * - nodes = spheres
 * - edges = glowing lines
 * - weight = size/intensity
 */
export default function FlowGraph3D({ socket }) {
  const mountRef = useRef(null);
  const graph = useFlowGraph3D(socket);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 60;

    const nodeMeshes = {};
    const edgeLines = [];

    function buildGraph() {
      Object.entries(graph.nodes || {}).forEach(([id, node]) => {
        if (!nodeMeshes[id]) {
          const geometry = new THREE.SphereGeometry(0.8, 16, 16);
          const material = new THREE.MeshBasicMaterial({
            color: 0x00ffff
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(
            Math.random() * 40 - 20,
            Math.random() * 40 - 20,
            Math.random() * 40 - 20
          );

          scene.add(mesh);
          nodeMeshes[id] = mesh;
        }

        const scale = Math.min(5, node.weight * 0.05);
        nodeMeshes[id].scale.set(scale, scale, scale);
      });

      Object.entries(graph.edges || {}).forEach(([id, edge]) => {
        const material = new THREE.LineBasicMaterial({
          color: 0x8a2be2,
          transparent: true,
          opacity: Math.min(1, edge.weight * 0.1)
        });

        const points = [];
        const from = nodeMeshes[edge.from];
        const to = nodeMeshes[edge.to];

        if (!from || !to) return;

        points.push(from.position);
        points.push(to.position);

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);

        scene.add(line);
        edgeLines.push(line);
      });
    }

    function animate() {
      requestAnimationFrame(animate);

      Object.values(nodeMeshes).forEach((m) => {
        m.rotation.x += 0.002;
        m.rotation.y += 0.003;
      });

      renderer.render(scene, camera);
    }

    const interval = setInterval(buildGraph, 1500);
    animate();

    return () => {
      clearInterval(interval);
      mountRef.current.innerHTML = "";
    };
  }, [graph]);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
}
