import React, { useEffect, useState } from "react";

export default function LiveFlowGraph() {

  const [graph, setGraph] = useState([]);

  useEffect(() => {

    const ws = new WebSocket("wss://afridigital-fmdash.onrender.com/flowgraph");

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "FLOWGRAPH_UPDATE") {
        setGraph(data.graph);
      }
    };

    return () => ws.close();

  }, []);

  return (
    <div style={{ padding: 20, background: "#050a18", color: "#0ff" }}>

      <h2>🌐 Live AI FlowGraph</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10
      }}>

        {graph.map((node, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #0ff3",
              padding: 10,
              background:
                node.type === "core"
                  ? "#003344"
                  : node.type === "agent"
                  ? "#332200"
                  : "#111"
            }}
          >
            <h4>{node.label}</h4>
            <pre style={{ fontSize: 10 }}>
              {JSON.stringify(node.data, null, 2)}
            </pre>
          </div>
        ))}

      </div>

    </div>
  );
}
