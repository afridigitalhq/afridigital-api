import React, { useEffect, useState } from "react";

export default function AdminPanel() {

  const [stream, setStream] = useState([]);
  const [graph, setGraph] = useState(null);

  useEffect(() => {

    const load = async () => {

      const s = await fetch("https://afridigital-fmdash.onrender.com/api/admin/stream")
        .then(r => r.json());

      const g = await fetch("https://afridigital-fmdash.onrender.com/api/admin/flowgraph")
        .then(r => r.json());

      setStream(s.stream);
      setGraph(g.graph);
    };

    load();

    const interval = setInterval(load, 2000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div style={{ padding: 20, color: "#0ff" }}>

      <h2>🧠 AI ECONOMIC CONTROL PANEL</h2>

      <h3>📡 Live Decision Stream</h3>
      <pre>{JSON.stringify(stream, null, 2)}</pre>

      <h3>🕸 FlowGraph State</h3>
      <pre>{JSON.stringify(graph, null, 2)}</pre>

    </div>
  );
}
