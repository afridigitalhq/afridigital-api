import React from "react";
import { useSOCLive } from "./useSOCLive";

export default function SOCLiveWarroom() {
  const soc = useSOCLive();

  return (
    <div style={{ background: "#05060a", color: "#0ff", padding: 20 }}>
      <h1>🧠 SOC WARROOM (LIVE)</h1>

      <div>Critical: {soc.summary.critical}</div>
      <div>Warnings: {soc.summary.warnings}</div>

      <div style={{ marginTop: 20 }}>
        {soc.incidents.map((i, idx) => (
          <div key={idx}>
            [{i.severity}] {i.type}
          </div>
        ))}
      </div>
    </div>
  );
}
