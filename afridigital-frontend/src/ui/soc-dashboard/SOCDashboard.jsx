import React from "react";

export default function SOCDashboard({ soc }) {
  return (
    <div style={{ padding: 20, color: "#fff", background: "#0a0a0a" }}>
      <h2>🧠 SOC WARROOM</h2>

      <div>Critical: {soc.summary.critical}</div>
      <div>Warnings: {soc.summary.warnings}</div>

      <div style={{ marginTop: 10 }}>
        {soc.incidents.map((i, idx) => (
          <div key={idx}>
            [{i.severity}] {i.type} - {i.timestamp}
          </div>
        ))}
      </div>
    </div>
  );
}
