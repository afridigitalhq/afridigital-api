import React from "react";

export default function GodModeOverlay({ state }) {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      background: state?.warState === "RED ALERT"
        ? "rgba(255,0,0,0.08)"
        : "transparent",
      pointerEvents: "none",
      animation: state?.warState === "RED ALERT"
        ? "pulse 1s infinite"
        : "none"
    }}>
      <h1 style={{ color: "red", padding: 20 }}>
        🧨 GOD MODE SOC ACTIVE
      </h1>
    </div>
  );
}
