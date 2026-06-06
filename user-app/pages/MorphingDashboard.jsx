import React, { useEffect, useState } from "react";

export default function MorphingDashboard() {

  const userId = "user-001";
  const [layout, setLayout] = useState([]);

  const fetchLayout = async () => {

    const res = await fetch(
      `https://afridigital-fmdash.onrender.com/api/ui/morph/${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentLayout: layout })
      }
    );

    const json = await res.json();
    setLayout(json.layout);
  };

  useEffect(() => {

    fetchLayout();

    const interval = setInterval(fetchLayout, 2000); // real-time morphing

    return () => clearInterval(interval);

  }, []);

  const renderWidget = (w) => {
    return (
      <div
        key={w}
        style={{
          padding: 15,
          margin: 10,
          background: "#0b1224",
          border: "1px solid #0ff3",
          borderRadius: 8,
          transition: "all 0.5s ease"
        }}
      >
        {w.toUpperCase()} WIDGET
      </div>
    );
  };

  return (
    <div style={{
      padding: 20,
      background: "#050a18",
      color: "#0ff",
      minHeight: "100vh"
    }}>
      <h2>🧠 Real-Time Morphing Dashboard</h2>

      <div>
        {layout.map(renderWidget)}
      </div>
    </div>
  );
}
