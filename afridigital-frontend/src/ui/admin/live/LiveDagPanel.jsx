import React, { useRef, useEffect } from "react";
import { bindWebGLLive } from "../../../viz/runtime/webglLiveRenderer";
import { useLiveDag } from "./useLiveDag";

export default function LiveDagPanel() {
  const canvasRef = useRef();
  const nodes = useLiveDag();

  useEffect(() => {
    if (!canvasRef.current) return;

    bindWebGLLive(canvasRef, () => nodes);
  }, [nodes]);

  return (
    <div>
      <h3>🧠 Live DAG Stream</h3>
      <canvas ref={canvasRef} width={800} height={400} />
    </div>
  );
}
