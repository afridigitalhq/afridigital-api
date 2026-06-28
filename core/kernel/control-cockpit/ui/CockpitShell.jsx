import React, { useEffect, useState } from "react";

/**
 * READ-ONLY UNIFIED CONTROL PLANE COCKPIT
 * SyscallGate governed system viewer
 */

export default function CockpitShell() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/core/kernel/control-cockpit/COCKPIT_CONTRACT.json")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Cockpit load error:", err));
  }, []);

  if (!data) {
    return <div style={{ color: "#0ff" }}>Loading Control Plane...</div>;
  }

  return (
    <div style={{ background: "#0b0f14", color: "#0ff", padding: 20 }}>
      <h1>🧭 Unified Control Plane Cockpit</h1>

      {Object.entries(data.panels).map(([key, panel]) => (
        <div key={key} style={{ border: "1px solid #0ff", margin: 10, padding: 10 }}>
          <h2>{panel.title}</h2>
          <p>Source: {panel.source}</p>
          <p>Access: {panel.access}</p>
        </div>
      ))}

      <footer style={{ marginTop: 20, opacity: 0.6 }}>
        SyscallGate: READ-ONLY RUNTIME SURFACE
      </footer>
    </div>
  );
}
