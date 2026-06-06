import React from "react";

export default function DashboardGrid({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: "12px",
        padding: "12px"
      }}
    >
      {children}
    </div>
  );
}
