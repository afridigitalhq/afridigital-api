import React from "react";

export default function DAGOverlay({ state }) {
  return (
    <div style={{
      position: "absolute",
      top: 10,
      left: 10,
      color: "#0ff",
      fontFamily: "monospace"
    }}>
      <div>MODE: {state.mode}</div>
      <div>RISK: {state.risk}</div>
      <div>STATUS: {state.risk > 0.7 ? "CRITICAL" : "STABLE"}</div>
    </div>
  );
}
