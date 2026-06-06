import React, { useState } from "react";

export default function SimulationLab() {

  const [result, setResult] = useState(null);

  const run = async () => {

    const res = await fetch(
      "https://afridigital-fmdash.onrender.com/api/admin/simulate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          users: 100,
          jobMultiplier: 1.5,
          boostMultiplier: 2
        })
      }
    );

    const json = await res.json();
    setResult(json);
  };

  return (
    <div style={{ padding: 20, background: "#050a18", color: "#0ff" }}>

      <h2>🧪 Marketplace Simulation Lab</h2>

      <button onClick={run}>
        Run Simulation
      </button>

      <pre style={{ marginTop: 20, fontSize: 12 }}>
        {JSON.stringify(result, null, 2)}
      </pre>

    </div>
  );
}
