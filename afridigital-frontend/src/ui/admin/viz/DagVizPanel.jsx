import React, { useEffect, useRef } from "react";
import { initWebGLDag } from "../../../viz/webgl/dagWebGLRenderer";

export default function DagVizPanel({ nodes = [] }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      initWebGLDag(ref.current, nodes);
    }
  }, [nodes]);

  return (
    <div>
      <h3>🌐 Live DAG WebGL View</h3>
      <canvas ref={ref} width={600} height={300} />
    </div>
  );
}
