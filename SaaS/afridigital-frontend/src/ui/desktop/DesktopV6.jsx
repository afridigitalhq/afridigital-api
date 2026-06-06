import { useState } from "react";
import GlassWindow from "../windows/GlassWindow";

export default function DesktopV6() {
  const [windows, setWindows] = useState([
    { id: "logs", title: "System Logs" },
    { id: "flowgraph", title: "FlowGraph Engine" },
    { id: "whatsapp", title: "WhatsApp Stream" }
  ]);

  return (
    <div style={{
      height: "100vh",
      width: "100%",
      background: "radial-gradient(circle at top, #05070f, #02040a)",
      overflow: "hidden",
      position: "relative"
    }}>
      {windows.map((w, i) => (
        <GlassWindow key={w.id} title={w.title} z={i + 1}>
          <div>⚙️ {w.id} module active</div>
        </GlassWindow>
      ))}
    </div>
  );
}
