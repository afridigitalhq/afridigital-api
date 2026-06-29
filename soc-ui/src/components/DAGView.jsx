import React, { useEffect, useRef } from "react";
import { GlowingDagRenderer } from "../gl/dag/GlowingDagRenderer";

export default function DAGView({ graph }) {
  const ref = useRef(null);
  const engine = useRef(null);

  useEffect(() => {
    if (ref.current) {
      engine.current = new GlowingDagRenderer(ref.current);
    }
  }, []);

  useEffect(() => {
    if (engine.current && graph) {
      engine.current.load(graph);
    }
  }, [graph]);

  return <div ref={ref} style={{ width: "100%", height: "600px" }} />;
}
