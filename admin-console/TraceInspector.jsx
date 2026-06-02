import React from "react";

export default function TraceInspector({ trace }) {
  if (!trace) {
    return (
      <div style={{ opacity: 0.6 }}>
        Select a trace to inspect lifecycle
      </div>
    );
  }

  return (
    <div>
      <h3>🔍 Trace Inspector</h3>

      <div style={{ fontSize: 12, opacity: 0.7 }}>
        Trace ID: {trace.id}
      </div>

      <div style={{ marginTop: 10 }}>
        {trace.events.map((e, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ color: "#00F5FF" }}>
              {e.type} → {e.stage}
            </div>

            <pre style={{ fontSize: 11, opacity: 0.8 }}>
              {JSON.stringify(e.payload, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
