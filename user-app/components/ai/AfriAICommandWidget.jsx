import React, { useState } from "react";

export default function AfriAICommandWidget() {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendCommand = async () => {
    if (!input) return;

    const message = input;
    setLogs(prev => [...prev, { type: "user", text: message }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://afridigital-fmdash.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          traceId: Date.now().toString()
        })
      });

      const data = await res.json();

      setLogs(prev => [...prev, {
        type: "ai",
        text: data?.result?.message || "🧠 Executed system command",
        intent: data?.intent,
        route: data?.route
      }]);

    } catch (e) {
      setLogs(prev => [...prev, {
        type: "ai",
        text: "⚠️ Backend connection failed"
      }]);
    }

    setLoading(false);
  };

  return (
    <div style={{
      padding: "12px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.08)"
    }}>
      <h3>🧠 AfriAI Command Center (LIVE)</h3>

      <div style={{
        height: "200px",
        overflowY: "auto",
        marginBottom: "10px",
        fontSize: "13px"
      }}>
        {logs.map((l, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            <b>{l.type === "user" ? "You" : "AI"}:</b> {l.text}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask AfriAI..."
        style={{
          width: "70%",
          padding: "8px",
          borderRadius: "8px",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "white"
        }}
      />

      <button
        onClick={sendCommand}
        disabled={loading}
        style={{
          marginLeft: "8px",
          padding: "8px 12px",
          borderRadius: "8px",
          background: loading ? "#555" : "#00e5ff",
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "Running..." : "Send"}
      </button>
    </div>
  );
}
