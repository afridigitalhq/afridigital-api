import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFlowGraph3D } from "../useFlowGraph3D";
import { useNodeNavigation } from "./useNodeNavigation";

/**
 * FLOWGRAPH 3D + AUTONOMOUS NAVIGATION LAYER
 * - click node → trace full decision path
 * - replay signal flow
 */
export default function FlowGraph3DNav({ socket }) {
  const mountRef = useRef(null);
  const graph = useFlowGraph3D(socket);

  const {
    activePath,
    replayIndex,
    onNodeClick,
    startReplay
  } = useNodeNavigation(graph);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 60;

    const nodes = {};
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function buildNodes() {
      Object.entries(graph.nodes || {}).forEach(([id]) => {
        if (nodes[id]) return;

        const geo = new THREE.SphereGeometry(0.8, 16, 16);
        const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff });

        const mesh = new THREE.Mesh(geo, mat);

        mesh.position.set(
          Math.random() * 50 - 25,
          Math.random() * 50 - 25,
          Math.random() * 50 - 25
        );

        mesh.userData.id = id;

        scene.add(mesh);
        nodes[id] = mesh;
      });
    }

    function highlightPath() {
      Object.values(nodes).forEach(n => {
        n.material.color.set(0x00ffff);
      });

      activePath.forEach((id, idx) => {
        if (!nodes[id]) return;

        if (idx <= replayIndex) {
          nodes[id].material.color.set(0xff00ff);
        }
      });
    }

    function animate() {
      requestAnimationFrame(animate);

      buildNodes();
      highlightPath();

      renderer.render(scene, camera);
    }

    function onClick(event) {
      const rect = renderer.domElement.getBoundingClientRect();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(Object.values(nodes));

      if (intersects.length > 0) {
        const nodeId = intersects[0].object.userData.id;
        onNodeClick(nodeId);
      }
    }

    renderer.domElement.addEventListener("click", onClick);

    animate();

    return () => {
      renderer.domElement.removeEventListener("click", onClick);
      mountRef.current.innerHTML = "";
    };
  }, [graph, activePath, replayIndex]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />

      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <button onClick={startReplay}>
          ▶ Replay Signal Flow
        </button>
      </div>
    </div>
  );
}
