import React from "react";
import SystemHealthWidget from "../../../widgets/SystemHealthWidget";

export default function DagLivePanel({ nodes, apiStatus, wsStatus }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SystemHealthWidget
        apiStatus={apiStatus}
        wsStatus={wsStatus}
        nodes={nodes.length}
      />

      <div style={{ padding: 10, border: "1px solid #222" }}>
        <h3>📊 Live DAG Nodes</h3>
        {nodes.map(n => (
          <div key={n.id}>
            {n.symbol} {n.id} — {n.status}
          </div>
        ))}
      </div>
    </div>
  );
}
