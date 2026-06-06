import { useState } from "react";
import { useDragWindow } from "../hooks/useDragWindow";

export default function GlassWindow({ title, children, z = 1 }) {
  const [pos, setPos] = useState({ x: 120, y: 80 });

  const { ref, startDrag } = useDragWindow(setPos);

  return (
    <div
      ref={ref}
      onMouseDown={() => {}}
      style={{
        position: "absolute",
        top: pos.y,
        left: pos.x,
        width: 420,
        backdropFilter: "blur(18px)",
        background: "rgba(10,15,25,0.6)",
        border: "1px solid rgba(0,229,255,0.25)",
        borderRadius: 14,
        color: "#fff",
        zIndex: z,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
      }}
    >
      <div
        onMouseDown={startDrag}
        style={{
          padding: 10,
          cursor: "grab",
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        🪟 {title}
      </div>

      <div style={{ padding: 12 }}>{children}</div>
    </div>
  );
}
