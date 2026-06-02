import React from "react";
import useMemoryStore from "./useMemoryStore";

export default function MemoryInspector({ trace }) {
  const memoryEvents = useMemoryStore(trace);

  if (!trace) {
    return <div style={{ opacity: 0.6 }}>Select trace to inspect memory</div>;
  }

  return (
    <div>
      <h3>🧠 Memory Inspector</h3>

      <div style={{ fontSize: 12, opacity: 0.7 }}>
        Memory operations: {memoryEvents.length}
      </div>

      <div style={{ marginTop: 15 }}>
        {memoryEvents.map((m) => (
          <div
            key={m.id}
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 8,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)"
            }}
          >
            <div style={{ color: "#A855F7", fontSize: 12 }}>
              {m.action}
            </div>

            <div style={{ fontSize: 11, opacity: 0.7 }}>
              Stage: {m.stage}
            </div>

            <pre style={{ fontSize: 11, marginTop: 6 }}>
              {JSON.stringify(m.payload, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
