import React from "react";
import { useCockpit } from "./useCockpit";
import dashboardRegistry from "../registry/dashboardRegistry";

export default function Cockpit({ flowGraphEngine }) {
  const state = useCockpit();

  return (
    <div style={{ padding: 20 }}>
      <h2>🧠 UNIFIED AI COCKPIT</h2>

      <h3>System Health</h3>
      <pre>{JSON.stringify(state.health, null, 2)}</pre>

      <h3>FlowGraph Status</h3>
      <div>
        {flowGraphEngine
          ? "🌐 Visual Cortex ACTIVE"
          : "⚠️ FlowGraph not connected"}
      </div>

      <h3>Active Panels</h3>
      <ul>
        {dashboardRegistry.map(p => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
}
