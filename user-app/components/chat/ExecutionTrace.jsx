import React from "react";

export default function ExecutionTrace({ trace = [] }) {
  return (
    <div className="card" style={{ maxHeight: "300px", overflowY: "auto" }}>
      <h4>AI Execution Trace</h4>

      {trace.length === 0 && (
        <p style={{ opacity: 0.5 }}>No execution data yet...</p>
      )}

      {trace.map((t, i) => (
        <div key={i} style={{
          padding: "6px",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}>
          <b>{t.step}</b>
          <div style={{ opacity: 0.7, fontSize: "12px" }}>
            {t.detail}
          </div>
        </div>
      ))}
    </div>
  );
}
