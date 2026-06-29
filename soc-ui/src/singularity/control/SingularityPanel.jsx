import React from "react";

export default function SingularityPanel({ data }) {
  return (
    <div style={{
      padding: 20,
      background: "rgba(0,0,0,0.6)",
      border: "1px solid #0ff",
      color: "#0ff",
      fontFamily: "monospace"
    }}>
      <h2>🧿 SINGULARITY SOC COMMANDER</h2>

      <pre>{JSON.stringify(data?.advisory, null, 2)}</pre>

      <h3>🧪 ATTACK SIMULATION</h3>
      <pre>{JSON.stringify(data?.simulation, null, 2)}</pre>

      <h4 style={{ color: "red" }}>
        MODE: READ-ONLY • NO AUTONOMY • HUMAN CONTROLLED
      </h4>
    </div>
  );
}
