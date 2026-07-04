import React, { useEffect, useState } from "react";
import ReactFlow from "reactflow";
import { AudioCore } from "../../core/godmode/audio/AudioCore";
import { CameraCore } from "../../core/godmode/render/CameraCore";
import { GodEngine } from "../../core/godmode/GodEngine";

export default function GodModeDAG({ nodes, edges }) {
  const [n, setN] = useState(nodes);
  const [cam, setCam] = useState({});

  useEffect(() => {
    const ctx = new AudioContext();
    const audio = new AudioCore(ctx);
    const camera = new CameraCore();
    const engine = new GodEngine(audio, camera);

    const loop = () => {
      const res = engine.tick(n);
      setN(res.nodes);
      setCam(res.cameraStyle);
      requestAnimationFrame(loop);
    };

    loop();
  }, []);

  return (
    <div className="god-mode-dag" style={cam}>
      <ReactFlow nodes={n} edges={edges} fitView />
    </div>
  );
}
