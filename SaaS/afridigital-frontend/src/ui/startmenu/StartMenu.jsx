import React from "react";
import { AppRegistry } from "../../os/apps/registry";

export default function StartMenu({ open, onLaunch }) {
  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 60,
      left: 10,
      width: 320,
      background: "rgba(5,7,15,0.95)",
      border: "1px solid rgba(0,229,255,0.25)",
      borderRadius: 12,
      padding: 12,
      backdropFilter: "blur(14px)"
    }}>
      <h3 style={{ color: "#fff" }}>🚀 Start Menu</h3>

      {AppRegistry.apps.map(app => (
        <div
          key={app.id}
          onClick={() => onLaunch(app)}
          style={{
            padding: 10,
            marginTop: 8,
            borderRadius: 8,
            cursor: "pointer",
            color: "#fff",
            background: "rgba(255,255,255,0.04)"
          }}
        >
          {app.icon} {app.name}
        </div>
      ))}
    </div>
  );
}
