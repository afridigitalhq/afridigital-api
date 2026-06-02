import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import useFlowGraph3D from "./useFlowGraph3D";

export default function FlowGraph3D() {
  const ref = useRef();
  const sceneRef = useRef();

  const data = useFlowGraph3D();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(600, 600);
    ref.current.appendChild(renderer.domElement);

    camera.position.z = 10;

    sceneRef.current = { scene, camera, renderer };

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    const { scene } = sceneRef.current;

    // clear scene
    scene.clear();

    // nodes
    data.nodes.forEach(n => {
      const geometry = new THREE.SphereGeometry(0.1 + n.weight * 0.05);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      const sphere = new THREE.Mesh(geometry, material);

      sphere.position.set(n.x, n.y, n.z);
      scene.add(sphere);
    });

    // edges
    data.edges.forEach(e => {
      const material = new THREE.LineBasicMaterial({ color: 0x8844ff });
      const points = [];

      const a = data.nodes.find(n => n.id === e.from);
      const b = data.nodes.find(n => n.id === e.to);

      if (!a || !b) return;

      points.push(new THREE.Vector3(a.x, a.y, a.z));
      points.push(new THREE.Vector3(b.x, b.y, b.z));

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);

      scene.add(line);
    });

  }, [data]);

  return <div ref={ref} />;
}
