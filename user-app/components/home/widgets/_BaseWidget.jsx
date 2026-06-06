import React from "react";

export default function BaseWidget({ title, children }) {
  return (
    <div style={styles.card}>
      {title && <h4 style={styles.title}>{title}</h4>}
      {children}
    </div>
  );
}

const styles = {
  card: {
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    minHeight: "120px"
  },
  title: {
    marginBottom: "8px",
    color: "#00e5ff"
  }
};
