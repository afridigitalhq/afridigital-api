import React from "react";
import { AppRegistry } from "../../os/apps/registry";

export default function Taskbar({ onLaunch }) {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: 50,
      background: "rgba(10,12,25,0.92)",
      borderTop: "1px solid rgba(0,229,255,0.25)",
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
      backdropFilter: "blur(12px)"
    }}>
      {AppRegistry.apps.map(app => (
        <button
          key={app.id}
          onClick={() => onLaunch(app)}
          style={{
            marginRight: 10,
            background: "transparent",
            border: "1px solid rgba(0,229,255,0.2)",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          {app.icon} {app.name}
        </button>
      ))}

      <div style={{ marginLeft: "auto", fontSize: 12, color: "#aaa" }}>
        AfriDigital OS
      </div>
    </div>
  );
}
