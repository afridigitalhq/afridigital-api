import React, { useEffect, useState } from "react";

export default function FlowGraphDashboard() {

  const [graph, setGraph] = useState([]);
  const [replay, setReplay] = useState([]);

  useEffect(() => {

    const loadLive = async () => {

      const res = await fetch(
        "https://afridigital-fmdash.onrender.com/api/admin/flowgraph/live"
      );

      const json = await res.json();
      setGraph(json);
    };

    loadLive();

    const interval = setInterval(loadLive, 3000);

    return () => clearInterval(interval);

  }, []);

  const loadReplay = async () => {

    const from = Date.now() - 1000 * 60 * 10;
    const to = Date.now();

    const res = await fetch(
      `https://afridigital-fmdash.onrender.com/api/admin/flowgraph/replay?from=${from}&to=${to}`
    );

    const json = await res.json();
    setReplay(json);
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#050a18", color: "#0ff" }}>

      {/* LIVE GRAPH */}
      <div style={{ flex: 2, padding: 20 }}>
        <h2>🔥 Live FlowGraph</h2>

        <pre style={{ fontSize: 12 }}>
          {JSON.stringify(graph, null, 2)}
        </pre>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, padding: 20, borderLeft: "1px solid #0ff3" }}>

        <h3>⏪ Replay Mode</h3>

        <button onClick={loadReplay}>
          Load Last 10 min
        </button>

        <pre style={{ fontSize: 12, marginTop: 10 }}>
          {JSON.stringify(replay, null, 2)}
        </pre>

      </div>

    </div>
  );
}
