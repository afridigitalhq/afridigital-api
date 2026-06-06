import React from "react";

export default function TopBar() {
  return (
    <div style={{
      padding: "10px 15px",
      background: "rgba(10,18,40,0.5)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(255,255,255,0.05)"
    }}>
      <strong>AfriDigital Hub</strong>
    </div>
  );
}
