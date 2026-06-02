import React, { useEffect, useState } from "react";
import { useObservabilityStream } from "./useObservabilityStream";
import { FlowGraphEngine } from "./flowGraphEngine";

export default function FlowGraphObservability() {
  const [engine] = useState(() => new FlowGraphEngine());
  const [graph, setGraph] = useState({ nodes: [], edges: [] });

  useObservabilityStream((event) => {
    engine.ingest(event);
    setGraph(engine.getGraph());
  });

  return (
    <div style={{ padding: 12 }}>
      <h3>🧠 FlowGraph Observability</h3>

      <div>
        <b>Nodes:</b> {graph.nodes.length} | <b>Edges:</b> {graph.edges.length}
      </div>

      <div style={{ marginTop: 12 }}>
        {graph.nodes.map((n) => (
          <div
            key={n.id}
            style={{
              padding: 6,
              margin: 4,
              background: `rgba(0,150,255,${Math.min(1, n.activity / 10)})`,
              borderRadius: 6
            }}
          >
            🔵 {n.id} — activity: {n.activity}
          </div>
        ))}
      </div>
    </div>
  );
}
