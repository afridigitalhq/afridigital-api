import React from "react";

export default function WidgetContainer({ title, children }) {
  return (
    <div
      style={{
        gridColumn: "span 6",
        padding: "12px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.08)"
      }}
    >
      {title && (
        <h3 style={{ marginBottom: "10px" }}>{title}</h3>
      )}
      {children}
    </div>
  );
}
