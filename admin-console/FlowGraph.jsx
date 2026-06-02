import React, { useMemo } from "react";
import useFlowGraph from "./useFlowGraph";

export default function FlowGraph({ trace }) {
  const graph = useFlowGraph(trace);

  if (!trace) {
    return <div style={{ opacity: 0.6 }}>Select trace to visualize flow</div>;
  }

  return (
    <div>
      <h3>🧠 Live Flow Graph</h3>

      <div style={{ marginTop: 20 }}>
        {/* NODES */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {graph.nodes.map((n) => (
            <div
              key={n.id}
              style={{
                padding: "8px 12px",
                borderRadius: 20,
                background:
                  n.type === "user"
                    ? "rgba(168,85,247,0.3)"
                    : "rgba(0,245,255,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: 12
              }}
            >
              {n.label}
            </div>
          ))}
        </div>

        {/* EDGES */}
        <div style={{ marginTop: 20, fontSize: 12, opacity: 0.7 }}>
          {graph.edges.map((e) => (
            <div key={e.id}>
              {e.from} → {e.to} ({e.label})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
