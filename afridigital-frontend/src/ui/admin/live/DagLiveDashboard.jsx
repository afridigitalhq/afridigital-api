import React from "react";
import { useLiveDag } from "./useLiveDag";

export default function DagLiveDashboard() {
  const state = useLiveDag();

  return (
    <div style={{ padding: 12 }}>
      <h2>🧠 Live DAG Stream</h2>

      <div>WS: {state.connected ? "🟢 LIVE" : "🔴 OFFLINE"}</div>

      <h3>Nodes</h3>
      <div>{state.nodes.length}</div>

      <h3>Regions</h3>
      <div>{state.regions.length}</div>

      <h3>Timeline Events</h3>
      <div>{state.events.length}</div>
    </div>
  );
}
