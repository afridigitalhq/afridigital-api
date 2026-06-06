import React, { useEffect, useState } from "react";

export default function UnifiedDashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {

    const load = async () => {

      const res = await fetch("https://afridigital-fmdash.onrender.com/api/copilot/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "general" })
      });

      const json = await res.json();
      setData(json);
    };

    load();

  }, []);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: 20,
      padding: 20,
      background: "#050a18",
      color: "#0ff",
      minHeight: "100vh"
    }}>

      {/* LEFT MAIN PANEL */}
      <div>

        <h2>🧠 AI Economy Command Center</h2>

        {/* WALLET */}
        <div style={box()}>
          <h3>💰 Wallet</h3>
          <div>Balance: $0 (mock)</div>
        </div>

        {/* JOBS */}
        <div style={box()}>
          <h3>📌 Jobs Feed</h3>
          <div>No jobs loaded (connected later)</div>
        </div>

        {/* BOOST */}
        <div style={box()}>
          <h3>🚀 Boost Panel</h3>
          <div>Boost visibility for listings</div>
        </div>

        {/* EARNINGS */}
        <div style={box()}>
          <h3>💸 Earnings</h3>
          <div>Track income activity</div>
        </div>

      </div>

      {/* RIGHT SIDE AI COPILOT */}
      <div style={{
        borderLeft: "1px solid #0ff3",
        paddingLeft: 20
      }}>

        <h3>🧠 AI Co-Pilot</h3>

        <div style={box()}>
          <h4>Smart Pricing Suggestion</h4>
          <div>{data?.pricingSuggestion || "Loading..."}</div>
        </div>

        <div style={box()}>
          <h4>Suggested Categories</h4>
          <pre>{JSON.stringify(data?.categorySuggestions || [], null, 2)}</pre>
        </div>

        <div style={box()}>
          <h4>Guidance</h4>
          <pre>{JSON.stringify(data?.guidance || [], null, 2)}</pre>
        </div>

      </div>

    </div>
  );
}

function box() {
  return {
    border: "1px solid #0ff3",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    background: "#0b1224"
  };
}
