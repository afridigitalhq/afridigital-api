import React from "react";

/**
 * 🧠 A3.18 VISUAL REASONING GRAPH
 * Simple live decision-tree renderer (no external libs)
 */

export default function ReasoningGraph({ graph }) {
  if (!graph) return null;

  return (
    <div style={wrap}>
      <h2>🧠 AI Reasoning Graph</h2>

      <div style={nodeBox}>
        <h3>Root: {graph.root}</h3>

        {graph.nodes.map((n, i) => (
          <div key={i} style={node}>
            <b>{n.label}</b>
            <p>Value: {String(n.value)}</p>
          </div>
        ))}
      </div>

      <pre style={edges}>
        {JSON.stringify(graph.edges, null, 2)}
      </pre>
    </div>
  );
}

const wrap = {
  padding: 20,
  background: "#0a0a0a",
  color: "#fff"
};

const nodeBox = {
  background: "#111",
  padding: 15,
  borderRadius: 10,
  marginBottom: 20
};

const node = {
  padding: 10,
  margin: 10,
  background: "#1a1a1a",
  borderRadius: 8
};

const edges = {
  background: "#000",
  padding: 10
};
