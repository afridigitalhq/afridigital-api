import React, { useEffect, useState } from "react";
import { windowManager } from "../../kernel/desktop/windowManager.js";
import { taskManager } from "../../kernel/desktop/taskManager.js";

export default function DesktopShell() {
  const [windows, setWindows] = useState([]);

  useEffect(() => {
    windowManager.subscribe(setWindows);
  }, []);

  const focus = (id) => {
    windowManager.focus(id);
    taskManager.setActive(id);
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(135deg,#050b18,#0b1a2e)",
      overflow: "hidden",
      position: "relative"
    }}>

      {/* WINDOWS RENDER LAYER */}
      {windows.map(win => (
        <div
          key={win.id}
          onMouseDown={() => focus(win.id)}
          style={{
            position: "absolute",
            top: win.y,
            left: win.x,
            width: win.width,
            height: win.height,
            zIndex: win.z,
            borderRadius: 12,
            background: "rgba(10,20,40,0.7)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(0,229,255,0.2)",
            color: "#fff",
            padding: 10,
            cursor: "grab"
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: 8 }}>
            🪟 {win.title}
          </div>

          <div>
            {JSON.stringify(win.data)}
          </div>
        </div>
      ))}

    </div>
  );
}
