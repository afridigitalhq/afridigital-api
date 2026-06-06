import React, { useState } from "react";
import { WindowSystem } from "../../os/windowSystem";

export default function Desktop({ children }) {
  const [, forceUpdate] = useState(0);

  const launch = (app) => {
    WindowSystem.create({ title: app });
    forceUpdate(v => v + 1);
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#05070f",
      overflow: "hidden",
      position: "relative",
      color: "white"
    }}>
      {children}

      {WindowSystem.windows.map((w) => (
        <div
          key={w.id}
          onMouseDown={() => WindowSystem.focus(w.id)}
          style={{
            position: "absolute",
            top: w.y,
            left: w.x,
            width: w.width,
            height: w.height,
            zIndex: w.z,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(0,229,255,0.2)",
            borderRadius: 12,
            backdropFilter: "blur(10px)",
            padding: 10
          }}
        >
          <b>{w.title}</b>
        </div>
      ))}

      <Desktop._launch = launch />
    </div>
  );
}
