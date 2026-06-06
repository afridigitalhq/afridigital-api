import React, { useEffect, useState } from "react";

export default function SimulationPanel() {

  const [data, setData] = useState(null);

  useEffect(() => {

    const load = async () => {

      const res = await fetch(
        "https://afridigital-fmdash.onrender.com/api/admin/simulation/predict"
      );

      const json = await res.json();
      setData(json);
    };

    load();

    const interval = setInterval(load, 3000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div style={{
      padding: 20,
      background: "#050a18",
      color: "#0ff",
      height: "100vh"
    }}>
      <h2>🔮 Predictive Simulation Engine</h2>

      <pre style={{ fontSize: 12 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
