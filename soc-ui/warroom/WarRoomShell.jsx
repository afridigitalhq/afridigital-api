import React from "react";
import CommandRail from "./layout/CommandRail";
import GlassPanels from "./layout/GlassPanels";
import DagWebGLCanvas from "./dag/DagWebGLCanvas";
import SOCConsole from "./terminal/SOCConsole";
import AIThreatPanel from "./forecast/AIThreatPanel";

export default function WarRoomShell() {
  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden relative">

      {/* 🌐 WEBGL DAG BACKGROUND */}
      <DagWebGLCanvas />

      {/* 🧠 LEFT COMMAND RAIL */}
      <CommandRail />

      {/* 🔥 FLOATING GLASS PANELS */}
      <GlassPanels />

      {/* 💻 SOC TERMINAL OVERLAY */}
      <SOCConsole />

      {/* 🧬 AI FORECAST PANEL */}
      <AIThreatPanel />

      {/* 🧨 BRAND MARK */}
      <div className="absolute bottom-2 right-4 text-xs opacity-40">
        AfriDigital SOC War Room
      </div>

    </div>
  );
}
