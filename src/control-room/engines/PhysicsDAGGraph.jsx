import React, { useEffect, useState, useRef } from "react";
import { UnifiedPluginRegistry } from "../../os/registry/UnifiedPluginRegistry";
import { ForceEngine } from "../physics/ForceEngine";

export default function PhysicsDAGGraph({ dagRuntime }) {
  const [nodes, setNodes] = useState([]);
  const engineRef = useRef(null);

  // build graph
  useEffect(() => {
    const n = UnifiedPluginRegistry.map((d, i) => ({
      id: d.id,
      label: `${d.icon} ${d.label}`,
      x: 400 + Math.random() * 200,
      y: 300 + Math.random() * 200,
      energy: 0
    }));

    const links = UnifiedPluginRegistry.slice(1).map((d, i) => ({
      source: UnifiedPluginRegistry[i % UnifiedPluginRegistry.length].id,
      target: d.id
    }));

    const engine = new ForceEngine(n, links);
    engineRef.current = engine;

    engine.tick((updated) => {
      setNodes([...updated]);
    });

  }, []);

  // DAGRuntime → physics injection
  useEffect(() => {
    if (!dagRuntime) return;

    const handler = (event) => {
      const id = event.type || event.nodeId;

      // inject energy into graph
      engineRef.current?.updateEnergy(id, 2);

      setNodes(prev =>
        prev.map(n =>
          n.id === id
            ? { ...n, energy: (n.energy || 0) + 1 }
            : n
        )
      );
    };

    dagRuntime.onEvent?.(handler);
    return () => dagRuntime.offEvent?.(handler);
  }, [dagRuntime]);

  return (
    <div style={{ width: "100%", height: "100vh", background: "#05070d", position: "relative" }}>
      {nodes.map(node => (
        <div
          key={node.id}
          style={{
            position: "absolute",
            left: node.x,
            top: node.y,
            padding: "10px 14px",
            borderRadius: 12,
            background: "#0b0f19",
            border: "1px solid #2b2f3a",
            color: "white",
            transform: `scale(${1 + node.energy * 0.05})`,
            boxShadow: node.energy > 2
              ? "0 0 25px rgba(255,80,80,0.8)"
              : "0 0 10px rgba(59,130,246,0.3)",
            transition: "all 0.2s ease"
          }}
        >
          {node.label}
        </div>
      ))}
    </div>
  );
}
