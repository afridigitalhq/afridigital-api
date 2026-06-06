import React, { useState } from "react";

export default function RevenueSimulator() {

  const [data, setData] = useState(null);

  const run = async () => {

    const res = await fetch(
      "https://afridigital-fmdash.onrender.com/api/admin/revenue/simulate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          users: 200,
          jobBoost: 1.8,
          boostBoost: 2.5
        })
      }
    );

    const json = await res.json();
    setData(json);
  };

  return (
    <div style={{ padding: 20, background: "#050a18", color: "#0ff" }}>

      <h2>🔥 Revenue Optimization Simulator</h2>

      <button onClick={run}>Run Simulation</button>

      {data && (
        <>
          <h3>📊 BEFORE</h3>
          <pre>{JSON.stringify(data.baseline, null, 2)}</pre>

          <h3>🚀 AFTER</h3>
          <pre>{JSON.stringify(data.optimized, null, 2)}</pre>

          <h3>📈 IMPACT</h3>
          <pre>{JSON.stringify(data.impact, null, 2)}</pre>

          <h2>
            {data.recommendation}
          </h2>
        </>
      )}

    </div>
  );
}
