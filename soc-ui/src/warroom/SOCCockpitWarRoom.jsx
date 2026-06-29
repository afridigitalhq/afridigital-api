import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SOCCockpitWarRoom() {
  const mountRef = useRef(null);

  useEffect(() => {
    // 🌐 WebGL WAR ROOM BACKGROUND
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // ⚡ Core energy field (SOC pulse grid)
    const geometry = new THREE.PlaneGeometry(50, 50, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true });
    const plane = new THREE.Mesh(geometry, material);

    scene.add(plane);
    camera.position.z = 20;

    const animate = () => {
      requestAnimationFrame(animate);
      plane.rotation.z += 0.002;
      renderer.render(scene, camera);
    };

    animate();

    return () => mountRef.current.removeChild(renderer.domElement);
  }, []);

  return (
    <div style={{ height: "100vh", background: "#05070a", color: "#00ffcc" }}>
      <div ref={mountRef} />

      {/* 🧠 COMMAND OVERLAY */}
      <div style={{
        position: "absolute",
        top: 20,
        left: 20,
        fontFamily: "monospace"
      }}>
        <h2>AFRIDIGITAL SOC WAR ROOM</h2>
        <p>LIVE CONTROL PLANE ACTIVE</p>
      </div>
    </div>
  );
}
