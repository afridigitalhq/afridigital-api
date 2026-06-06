import React, { useState } from "react";
import { WindowManager } from "./windowManager";

export default function Desktop({ children }) {
  const [windows, setWindows] = useState([]);

  WindowManager.on("window:create", (w) => {
    setWindows((prev) => [...prev, w]);
  });

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#05070f",
      overflow: "hidden",
      position: "relative"
    }}>
      {children}

      {windows.map((w) => (
        <div key={w.id} style={{
          position: "absolute",
          top: w.y,
          left: w.x,
          width: w.width,
          height: w.height,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(0,229,255,0.2)",
          borderRadius: 12,
          backdropFilter: "blur(10px)",
          padding: 10
        }}>
          <b>{w.title}</b>
        </div>
      ))}
    </div>
  );
}
