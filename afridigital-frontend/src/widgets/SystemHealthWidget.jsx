import React from "react";

export default function SystemHealthWidget({ apiStatus, wsStatus, nodes = 0 }) {
  return (
    <div style={{ padding: 12, border: "1px solid #333", borderRadius: 8 }}>
      <h3>🧠 System Health</h3>
      <p>API: {apiStatus}</p>
      <p>WS: {wsStatus}</p>
      <p>Nodes: {nodes}</p>
    </div>
  );
}
