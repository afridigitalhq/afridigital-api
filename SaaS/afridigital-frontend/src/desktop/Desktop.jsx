import React, { useState } from "react";
import Taskbar from "../ui/taskbar/Taskbar";
import StartMenu from "../ui/startmenu/StartMenu";
import { WindowMotion } from "../ui/animations/windowMotion";

export default function Desktop() {
  const [windows, setWindows] = useState([]);
  const [startOpen, setStartOpen] = useState(false);

  const launch = (app) => {
    const win = {
      id: Date.now(),
      title: app.name,
      icon: app.icon,
      x: 120,
      y: 120,
      width: 520,
      height: 360
    };

    setWindows(prev => [...prev, win]);
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#05070f",
      overflow: "hidden",
      position: "relative"
    }}>
      {/* WINDOWS */}
      {windows.map(w => (
        <div
          key={w.id}
          style={{
            position: "absolute",
            width: w.width,
            height: w.height,
            left: w.x,
            top: w.y,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(0,229,255,0.2)",
            borderRadius: 12,
            backdropFilter: "blur(14px)",
            padding: 12,
            color: "#fff",
            transition: WindowMotion.ease
          }}
        >
          <b>{w.icon} {w.title}</b>
        </div>
      ))}

      {/* START MENU */}
      <StartMenu open={startOpen} onLaunch={launch} />

      {/* TASKBAR */}
      <Taskbar
        onLaunch={(app) => launch(app)}
      />
    </div>
  );
}
