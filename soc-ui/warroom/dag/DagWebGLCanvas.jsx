import React, { useEffect, useRef } from "react";

export default function DagWebGLCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    // placeholder for future:
    // - WebGL shader heatmap
    // - force-directed DAG physics
    console.log("🧠 DAG WebGL Engine initialized (stub)");
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 z-0"
    />
  );
}
