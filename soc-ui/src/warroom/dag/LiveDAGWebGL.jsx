import React, { useEffect, useRef } from "react";
import { WebGLCore } from "../engine/webgl/WebGLCore";

export default function LiveDAGWebGL() {
  const ref = useRef(null);

  useEffect(() => {
    const engine = new WebGLCore(ref.current);

    const interval = setInterval(() => {
      const state = engine.simulate();
      console.log("🔥 SOC PHYSICS STATE:", state);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dag-webgl-canvas">
      <canvas ref={ref} />
    </div>
  );
}
