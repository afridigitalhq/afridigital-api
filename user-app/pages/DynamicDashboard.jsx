import React, { useEffect, useState } from "react";

export default function DynamicDashboard() {

  const userId = "user-001";

  const [layout, setLayout] = useState([]);

  useEffect(() => {

    const load = async () => {

      const res = await fetch(
        `https://afridigital-fmdash.onrender.com/api/ui/layout/${userId}`
      );

      const json = await res.json();

      setLayout(json.layout);
    };

    load();

  }, []);

  const renderWidget = (w) => {

    switch (w) {

      case "wallet":
        return <div key={w}>💰 Wallet Widget</div>;

      case "jobs":
        return <div key={w}>📌 Jobs Widget</div>;

      case "boost":
        return <div key={w}>🚀 Boost Widget</div>;

      case "earnings":
        return <div key={w}>💸 Earnings Widget</div>;

      case "copilot":
        return <div key={w}>🧠 AI Co-Pilot</div>;

      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 20, background: "#050a18", color: "#0ff" }}>
      <h2>🧠 Personalized AI Dashboard</h2>

      {layout?.map(renderWidget)}
    </div>
  );
}
