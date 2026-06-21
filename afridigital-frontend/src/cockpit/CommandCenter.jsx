import React, { useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

import { usePhysicsStream } from "../physics/usePhysicsStream";

function HeatOverlay({ nodes }) {
  const critical = nodes.filter(n => (n.physics?.heat || 0) > 60);

  return (
    <div style={{
      position: "absolute",
      top: 10,
      right: 10,
      padding: 12,
      background: "rgba(10,0,0,0.8)",
      border: "1px solid red",
      color: "#ff4444",
      fontSize: 12,
      zIndex: 999
    }}>
      🚨 COMMAND CENTER ACTIVE<br/>
      Critical: {critical.length}
    </div>
  );
}

export default function CommandCenter() {
  const nodes = usePhysicsStream("wss://afridigital-api.onrender.com");

  const rfNodes = useMemo(() =>
    (nodes || []).map(n => ({
      id: String(n.id),
      position: {
        x: (n.physics?.velocity || 1) * 90,
        y: (n.physics?.heat || 0) * 6
      },
      data: { label: n.type || "node" }
    }))
  , [nodes]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <HeatOverlay nodes={nodes || []} />

      <ReactFlow nodes={rfNodes} edges={[]}>
        <Background />
        <Controls />
      </ReactFlow>

      <div style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        color: "#00ffff",
        fontSize: 12
      }}>
        LIVE SOC GRID
      </div>
    </div>
  );
}
