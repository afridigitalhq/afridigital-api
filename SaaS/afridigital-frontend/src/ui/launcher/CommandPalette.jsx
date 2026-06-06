import React, { useEffect } from "react";
import { WindowSystem } from "../../os/windowSystem";

export default function CommandPalette({ open, setOpen }) {

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "k" && e.ctrlKey) {
        setOpen((v) => !v);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      top: "30%",
      left: "30%",
      width: 400,
      background: "#0a0f1f",
      border: "1px solid cyan",
      padding: 20,
      color: "white",
      borderRadius: 12
    }}>
      <h3>⚡ Command Palette</h3>

      <button onClick={() => WindowSystem.create({ title: "System Monitor" })}>
        Open System Monitor
      </button>

      <button onClick={() => WindowSystem.create({ title: "FlowGraph" })}>
        Open FlowGraph
      </button>
    </div>
  );
}
