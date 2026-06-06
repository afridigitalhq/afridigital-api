import React, { useEffect, useState } from "react";

export default function DecisionHeatmap() {

  const [data, setData] = useState(null);

  const load = async () => {

    const res = await fetch(
      "https://afridigital-fmdash.onrender.com/api/admin/decision-heatmap"
    );

    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20, background: "#050a18", color: "#0ff" }}>

      <h2>🔥 Admin Decision Heatmap</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 10
      }}>

        {data?.points?.map((p, i) => (
          <div
            key={i}
            style={{
              padding: 10,
              border: "1px solid #0ff3",
              background:
                p.intensity === "RED"
                  ? "#330000"
                  : p.intensity === "YELLOW"
                  ? "#333300"
                  : "#003300"
            }}
          >
            <div style={{ fontSize: 12 }}>
              {p.label}
            </div>

            <div>📈 Impact: {p.x}</div>
            <div>⚡ Urgency: {p.y}</div>

            <div>🎯 Score: {p.score}</div>
          </div>
        ))}

      </div>

    </div>
  );
}
