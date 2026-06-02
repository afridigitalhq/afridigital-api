import React, { useEffect, useState } from "react";

/**
 * 🧠 KERNEL CONTROL CONSOLE
 * READ-ONLY OS CONTROL ROOM
 */
export default function KernelControlConsole({ socket }) {

  const [kernel, setKernel] = useState({});
  const [mode, setMode] = useState("observability");
  const [events, setEvents] = useState([]);

  // 📡 subscribe to kernel state
  useEffect(() => {

    socket.emit("KERNEL_SUBSCRIBE");

    socket.on("KERNEL_STATE", (state) => {
      setKernel(state);
      setMode(state.mode);
    });

    socket.on("TRACE", (e) => {
      setEvents(prev => [e, ...prev].slice(0, 100));
    });

    return () => {
      socket.off("KERNEL_STATE");
      socket.off("TRACE");
    };

  }, []);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "280px 1fr",
      height: "100vh",
      background: "#0b0b0b",
      color: "#0f0",
      fontFamily: "monospace"
    }}>

      {/* LEFT: CONTROL PANEL */}
      <div style={{ padding: 12, borderRight: "1px solid #222" }}>

        <h2>🧠 KERNEL CONTROL</h2>

        <h3>Mode</h3>
        <div style={{ padding: 8, background: "#111" }}>
          {mode}
        </div>

        <h3>Switch Mode</h3>
        <button onClick={() => socket.emit("KERNEL_MODE", { mode: "observability" })}>
          Observability
        </button><br/>

        <button onClick={() => socket.emit("KERNEL_MODE", { mode: "diagnostic" })}>
          Diagnostic
        </button><br/>

        <button onClick={() => socket.emit("KERNEL_MODE", { mode: "replay" })}>
          Replay
        </button>

        <h3>Kernel Snapshot</h3>
        <pre style={{ fontSize: 11 }}>
          {JSON.stringify(kernel, null, 2)}
        </pre>

      </div>

      {/* RIGHT: LIVE SYSTEM FEED */}
      <div style={{ padding: 12 }}>

        <h2>📡 Live Kernel Feed</h2>

        <div style={{ height: "45%", overflow: "auto", background: "#111", padding: 10 }}>
          {events.map((e, i) => (
            <div key={i}>
              [{e.type}] {e.traceId}
            </div>
          ))}
        </div>

        {/* FUTURE: FlowGraph embed slot */}
        <div style={{
          marginTop: 10,
          height: "45%",
          border: "1px solid #222",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          🧬 FlowGraph Visual Cortex (embed here)
        </div>

      </div>

    </div>
  );
}
