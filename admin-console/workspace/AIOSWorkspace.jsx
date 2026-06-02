import React, { useState } from "react";

/**
 * 🧠 AI OS DESKTOP WORKSPACE
 * responsive + draggable + modular layout shell
 */

export default function AIOSWorkspace({
  KernelConsole,
  FlowGraph,
  ObservabilityPanel,
  socket
}) {

  const [layout, setLayout] = useState("desktop"); 
  // desktop | mobile | split

  return (
    <div className={`workspace ${layout}`}>

      {/* TOP BAR */}
      <div className="topbar">
        🧠 AI OS WORKSPACE

        <div>
          <button onClick={() => setLayout("desktop")}>Desktop</button>
          <button onClick={() => setLayout("split")}>Split</button>
          <button onClick={() => setLayout("mobile")}>Mobile</button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid">

        {/* KERNEL CONSOLE */}
        <div className="panel kernel">
          <KernelConsole socket={socket} />
        </div>

        {/* FLOWGRAPH VISUAL CORTEX */}
        <div className="panel flowgraph">
          <FlowGraph socket={socket} />
        </div>

        {/* OBSERVABILITY / TABLES */}
        <div className="panel observability">
          <ObservabilityPanel socket={socket} />
        </div>

      </div>

      <style>{`
        .workspace {
          width: 100%;
          height: 100vh;
          background: #0b0b0b;
          color: #0f0;
          display: flex;
          flex-direction: column;
        }

        .topbar {
          height: 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          border-bottom: 1px solid #222;
        }

        .grid {
          flex: 1;
          display: grid;
          grid-template-columns: 300px 1fr 1fr;
          gap: 8px;
          padding: 8px;
        }

        .panel {
          background: #111;
          border: 1px solid #222;
          overflow: auto;
        }

        /* 🖥️ DESKTOP MODE */
        .desktop .grid {
          grid-template-columns: 300px 1fr 1fr;
        }

        /* 🔀 SPLIT MODE */
        .split .grid {
          grid-template-columns: 1fr 1fr;
        }

        /* 📱 MOBILE MODE */
        .mobile .grid {
          grid-template-columns: 1fr;
        }

        .mobile .panel {
          height: 300px;
        }
      `}</style>

    </div>
  );
}
