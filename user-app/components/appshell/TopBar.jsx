import React from "react";

export default function TopBar() {
  return (
    <div style={styles.topbar}>
      <div>🧠 AfriDigital OS</div>
      <div style={{ opacity: 0.7 }}>Command Center Active</div>
    </div>
  );
}

const styles = {
  topbar: {
    height: "50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)"
  }
};
