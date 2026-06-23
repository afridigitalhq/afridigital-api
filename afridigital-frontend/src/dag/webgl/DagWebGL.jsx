import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DagWebGL({ nodes, edges }) {
  const mountRef = useRef(null);

  
  useEffect(() => {
    const mountNode = mountRef.current;
    let lastFrame = 0;

    function renderFrame(time) {
      requestAnimationFrame(renderFrame);

      if (!mountNode) return;

      for (const n of (nodes || [])) {
        // safe placeholder render
      }
    }

    requestAnimationFrame(renderFrame);

    return () => {
      if (mountNode && mountNode.firstChild) {
        mountNode.innerHTML = "";
      }
    };
  }, [nodes, edges]);


  return <div ref={mountRef} />;
}
