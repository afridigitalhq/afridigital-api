import React, { useEffect, useState } from "react";

export default function StrategyDashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {

    const load = async () => {

      const res = await fetch(
        "https://afridigital-fmdash.onrender.com/api/admin/strategy"
      );

      const json = await res.json();
      setData(json);
    };

    load();
    const interval = setInterval(load, 5000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div style={{ padding: 20, background: "#050a18", color: "#0ff" }}>

      <h2>🧠 AfriAI Strategy Dashboard</h2>

      <p>Generated Plans: {data?.totalPlans}</p>

      {data?.plans?.map((p, i) => (
        <div key={i} style={{ border: "1px solid #0ff3", margin: 10, padding: 10 }}>

          <h3>{p.title}</h3>

          <strong>Focus:</strong> {p.focus}

          <h4>Steps:</h4>
          <ul>
            {p.steps.map((s, j) => (
              <li key={j}>{s}</li>
            ))}
          </ul>

          <div>
            📈 Demand Impact: {p.impactForecast.demandIncrease.toFixed(1)}%
          </div>

          <div>
            💰 Earnings Boost: {p.impactForecast.earningsBoost.toFixed(1)}%
          </div>

        </div>
      ))}

    </div>
  );
}
