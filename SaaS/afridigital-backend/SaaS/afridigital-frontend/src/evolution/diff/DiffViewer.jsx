import React from "react";

/**
 * ⚡ A3.18.2 DIFF VIEWER
 * Human-readable evolution diff inspection
 */

export default function DiffViewer({ before, after }) {

  return (
    <div style={{
      background: "#0b0b0b",
      color: "#fff",
      padding: 20,
      borderRadius: 12
    }}>

      <h2>🧬 Evolution Diff Viewer</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20
      }}>

        <div>
          <h3>📜 BEFORE</h3>

          <pre style={{
            background: "#111",
            padding: 15,
            borderRadius: 10,
            overflow: "auto",
            maxHeight: 500
          }}>
{JSON.stringify(before, null, 2)}
          </pre>
        </div>

        <div>
          <h3>⚡ AFTER</h3>

          <pre style={{
            background: "#111",
            padding: 15,
            borderRadius: 10,
            overflow: "auto",
            maxHeight: 500
          }}>
{JSON.stringify(after, null, 2)}
          </pre>
        </div>

      </div>

    </div>
  );
}
