import React from "react";

/**
 * Lightweight FlowGraph renderer (no external libs)
 * Admin UI only
 */
export default function FlowGraphView({ graph, onSelectNode }) {

  const nodes = graph?.nodes || [];
  const edges = graph?.edges || [];

  return (
    <div style={{ padding: 20, position: "relative" }}>

      <h2>🕸 AI FlowGraph</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10
      }}>

        {nodes.map((node, i) => (
          <div
            key={node.id}
            onClick={() => onSelectNode(node)}
            style={{
              padding: 10,
              border: "1px solid #0ff5",
              borderRadius: 8,
              cursor: "pointer",
              background: "#0b1224",
              boxShadow: "0 0 10px #0ff2"
            }}
          >
            <div><b>{node.type}</b></div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>
              {new Date(node.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}

      </div>

      <div style={{ marginTop: 20, fontSize: 12, opacity: 0.7 }}>
        Edges: {edges.length} | Nodes: {nodes.length}
      </div>

    </div>
  );
}
