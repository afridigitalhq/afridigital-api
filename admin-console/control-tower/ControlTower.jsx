import React, { useEffect, useState } from "react";

/**
 * 🧠 AI OS CONTROL TOWER
 * Single cockpit view (READ ONLY)
 */

export default function ControlTower() {
  const [state, setState] = useState({
    backend: null,
    frontend: null,
    system: null,
    stream: "disconnected"
  });

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch("/api/system/health"); 
        const data = await res.json();
        setState(prev => ({ ...prev, system: data }));
      } catch (e) {}
    }

    fetchHealth();
    const t = setInterval(fetchHealth, 3000);

    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "Arial" }}>
      <h2>🧠 AI OS CONTROL TOWER</h2>

      <div style={{ marginTop: 12 }}>
        <h3>⚡ System Status</h3>
        <pre>{JSON.stringify(state.system, null, 2)}</pre>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>🌐 Stream</h3>
        <p>Status: {state.stream}</p>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>📊 Live Summary</h3>
        <ul>
          <li>Backend: monitored</li>
          <li>Frontend: monitored</li>
          <li>Observability: active</li>
          <li>FlowGraph: connected</li>
        </ul>
      </div>
    </div>
  );
}
