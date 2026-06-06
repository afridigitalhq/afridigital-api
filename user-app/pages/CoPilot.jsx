import React, { useState } from "react";

export default function CoPilot() {

  const [input, setInput] = useState({});
  const [result, setResult] = useState(null);

  const run = async () => {

    const res = await fetch(
      "https://afridigital-fmdash.onrender.com/api/copilot/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      }
    );

    const json = await res.json();
    setResult(json);
  };

  return (
    <div style={{ padding: 20, background: "#050a18", color: "#0ff" }}>
      <h2>🧠 AI Marketplace Co-Pilot</h2>

      <input
        placeholder="Category (e.g. design, coding, marketing)"
        onChange={(e) => setInput({ ...input, category: e.target.value })}
      />

      <button onClick={run}>Generate Guidance</button>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
