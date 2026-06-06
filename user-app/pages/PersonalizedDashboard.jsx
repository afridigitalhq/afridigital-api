import React, { useEffect, useState } from "react";

export default function PersonalizedDashboard() {

  const userId = "user-001";
  const [layout, setLayout] = useState([]);

  useEffect(() => {

    const load = async () => {

      const res = await fetch(
        `https://afridigital-fmdash.onrender.com/api/ui/personalized/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "user",
            walletActivity: 2,
            jobActivity: 5,
            boostActivity: 1,
            earningsActivity: 3,
            copilotUsage: 4
          })
        }
      );

      const json = await res.json();
      setLayout(json.layout);
    };

    load();

  }, []);

  return (
    <div style={{
      padding: 20,
      background: "#050a18",
      color: "#0ff"
    }}>
      <h2>🧠 Personalized Dashboard</h2>

      {layout.map((w) => (
        <div key={w} style={{
          padding: 15,
          margin: 10,
          border: "1px solid #0ff3",
          borderRadius: 8
        }}>
          {w.toUpperCase()} WIDGET
        </div>
      ))}
    </div>
  );
}
