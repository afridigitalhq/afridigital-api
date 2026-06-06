import React, { useEffect, useState } from "react";

export default function TraceViewer() {

  const [traces, setTraces] = useState([]);
  const [graph, setGraph] = useState(null);

  useEffect(() => {

    const load = async () => {

      const t = await fetch("https://afridigital-fmdash.onrender.com/api/admin/traces")
        .then(r => r.json());

      const g = await fetch("https://afridigital-fmdash.onrender.com/api/admin/live-graph")
        .then(r => r.json());

      setTraces(t.traces);
      setGraph(g.graph);
    };

    load();

    const interval = setInterval(load, 1500); // near real-time

    return () => clearInterval(interval);

  }, []);

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#050a18",
      color: "#0ff"
    }}>

      {/* TRACE STREAM */}
      <div style={{ flex: 2, padding: 20, overflow: "auto" }}>
        <h2>🧠 Orchestrator Trace Stream</h2>

        {traces.slice(-20).map((t, i) => (
          <div key={i} style={{
            padding: 10,
            margin: 5,
            border: "1px solid #0ff3",
            borderRadius: 6
          }}>
            <div><b>{t.intent}</b></div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>
              {t.traceId}
            </div>
          </div>
        ))}
      </div>

      {/* FLOWGRAPH VIEW */}
      <div style={{ flex: 2, padding: 20, borderLeft: "1px solid #0ff3" }}>
        <h2>🕸 Live FlowGraph Sync</h2>

        <pre style={{ fontSize: 11 }}>
          {JSON.stringify(graph, null, 2)}
        </pre>
      </div>

    </div>
  );
}
