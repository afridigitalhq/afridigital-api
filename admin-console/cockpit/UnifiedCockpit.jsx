import React, { useEffect, useState } from "react";
import FlowGraphTimeBridge from "../flowgraph-time/FlowGraphTimeBridge";

/**
 * 🧠 UNIFIED AI OBSERVATORY COCKPIT
 * READ-ONLY ORCHESTRATION LAYER
 */
export default function UnifiedCockpit({ socket, engine, renderer }) {

  const [health, setHealth] = useState({});
  const [events, setEvents] = useState([]);

  useEffect(() => {

    // 🔁 LIVE EVENT STREAM
    socket.on("TRACE", (e) => {
      setEvents(prev => [e, ...prev].slice(0, 50));
    });

    socket.on("SYSTEM_HEALTH", (h) => {
      setHealth(h);
    });

    return () => {
      socket.off("TRACE");
      socket.off("SYSTEM_HEALTH");
    };

  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, height: "100vh" }}>

      {/* LEFT CONTROL PANEL */}
      <div style={{ background: "#111", color: "#0f0", padding: 10, overflow: "auto" }}>

        <h2>🧠 AI OBSERVATORY</h2>

        <h3>⚡ System Health</h3>
        <pre>{JSON.stringify(health, null, 2)}</pre>

        <h3>📡 Live Trace Feed</h3>
        <div>
          {events.map((e, i) => (
            <div key={i}>
              [{e.type}] {e.traceId}
            </div>
          ))}
        </div>

      </div>

      {/* RIGHT VISUAL CORTEX */}
      <div style={{ display: "flex", flexDirection: "column" }}>

        {/* FLOWGRAPH + TIME SCRUB */}
        <div style={{ flex: 2 }}>
          <FlowGraphTimeBridge engine={renderer} socket={socket} />
        </div>

        {/* OPTIONAL: causal + debug panel placeholder */}
        <div style={{ flex: 1, background: "#0a0a0a", color: "#aaa", padding: 10 }}>
          <h3>🧬 Causal Layer</h3>
          <p>Click a node to reconstruct decision chain</p>
        </div>

      </div>

    </div>
  );
}
