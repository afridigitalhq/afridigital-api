import React, { useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

import { usePropagationField } from "../propagation/usePropagationField";

export default function CommandCenterPropagation() {
  const nodes = usePropagationField("wss://afridigital-api.onrender.com", []);

  const rfNodes = useMemo(() =>
    (nodes || []).map(n => ({
      id: String(n.id),
      position: {
        x: (n.propagation?.velocity || 1) * 90,
        y: (n.propagation?.heat || 0) * 6
      },
      data: {
        label: `🔥 ${n.type || "node"}`
      },
      style: {
        background: `rgba(255,0,0,${Math.min(0.8, (n.propagation?.heat || 0)/100)})`,
        border: "1px solid rgba(255,80,80,0.5)"
      }
    }))
  , [nodes]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow nodes={rfNodes} edges={[]}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
