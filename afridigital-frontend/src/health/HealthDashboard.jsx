import React from "react";
import { computeHealth } from "./metrics";

export default function HealthDashboard({ events }) {
  const health = computeHealth(events);

  const color =
    health.systemState === "HEALTHY" ? "#00ff88" :
    health.systemState === "DEGRADED" ? "#ffaa00" :
    "#ff3b3b";

  return (
    <div style={{
      position: "absolute",
      top: 0,
      right: 0,
      width: "320px",
      height: "100%",
      background: "#0a0a0f",
      color: "#ccc",
      padding: "12px",
      borderLeft: "1px solid #222",
      fontFamily: "monospace"
    }}>
      <h3 style={{ color: "#00c2ff" }}>SYSTEM HEALTH</h3>

      <div>Status:
        <span style={{ color }}>{health.systemState}</span>
      </div>

      <div>Success Rate: {health.successRate}%</div>
      <div>Total Events: {health.totalEvents}</div>
      <div>Failures: {health.failedEvents}</div>
      <div>Slow Ops: {health.slowEvents}</div>

      <hr style={{ borderColor: "#222" }} />

      <div style={{ color: "#888" }}>
        LIVE OBSERVABILITY PANEL
      </div>
    </div>
  );
}
