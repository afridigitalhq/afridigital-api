import React, { useEffect, useState } from "react";
import { createTraceStream } from "../stream/traceStream";

export default function GraphPage() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const stream = createTraceStream((event) => {
      setNodes(prev => [...prev, event]);
    });

    return () => stream.close();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Live Execution Graph</h2>

      <div style={{
        marginTop: 20,
        fontFamily: "monospace"
      }}>
        {nodes.map((n, i) => (
          <div key={i}>
            🧩 {n.traceId} → {n.type || n.node}
          </div>
        ))}
      </div>
    </div>
  );
}
