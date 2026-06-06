import React, { useEffect, useState } from "react";

export default function FlowGraphPanel() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("wss://afridigital-fmdash.onrender.com");

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        setEvents((prev) => [...prev.slice(-20), data]);
      } catch (e) {}
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{
      height: "300px",
      overflowY: "auto",
      padding: "10px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.05)"
    }}>
      <h3>🧠 FlowGraph Execution Trace</h3>

      {events.map((e, i) => (
        <div key={i} style={{ fontSize: "12px", marginBottom: "6px" }}>
          <b>{e.event}</b>
          <div style={{ opacity: 0.7 }}>
            {JSON.stringify(e.payload).slice(0, 120)}
          </div>
        </div>
      ))}
    </div>
  );
}
