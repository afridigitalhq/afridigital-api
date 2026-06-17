import React from "react";

export default function Timeline({ events, onScrub }) {
  return (
    <div style={{
      position: "absolute",
      bottom: 0,
      width: "100%",
      background: "#0a0a0f",
      padding: "10px",
      color: "#00c2ff"
    }}>
      <input
        type="range"
        min="0"
        max={events.length}
        onChange={(e) => onScrub(Number(e.target.value))}
        style={{ width: "100%" }}
      />
      <div>TIME TRAVEL SCRUBBER</div>
    </div>
  );
}
