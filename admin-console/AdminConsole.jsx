import React, { useState } from "react";
import dashboardRegistry from "./registry/dashboardRegistry";

/**
 * UNIFIED AI OS ADMIN CONSOLE
 * - Sidebar generated from registry
 * - Dynamic component routing
 * - No hardcoded panels
 */

import TraceInspector from "./TraceInspector";
import TraceReplay from "./TraceReplay";
import FlowGraph from "./FlowGraph";
import MemoryInspector from "./MemoryInspector";
import DecisionInspector from "./DecisionInspector";
import PromptEvolution from "./PromptEvolution";
import SelfDiagnosticPanel from "./SelfDiagnosticPanel";
import AutoFixPanel from "./AutoFixPanel";
// NOTE: SnapshotManager + ControlPlane assumed existing or stubbed

const componentMap = {
  TraceInspector,
  TraceReplay,
  FlowGraph,
  MemoryInspector,
  DecisionInspector,
  PromptEvolution,
  SelfDiagnosticPanel,
  AutoFixPanel,
  SnapshotManager: () => <div>Snapshots (WIP)</div>,
  ControlPlane: () => <div>Control Plane (WIP)</div>,
  Overview: () => (
    <div style={{ padding: 20 }}>
      <h2>🧠 AI System Health Overview</h2>
      <p>Unified operational intelligence dashboard</p>
    </div>
  )
};

export default function AdminConsole() {
  const [active, setActive] = useState("overview");

  const activePanel = dashboardRegistry.find(p => p.id === active);

  const ActiveComponent =
    componentMap[activePanel?.component] || (() => <div>Not Found</div>);

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR (DRIVEN BY REGISTRY) */}
      <div style={{ width: 260, borderRight: "1px solid #222" }}>
        <div style={{ padding: 12, fontWeight: "bold" }}>
          🧠 AI OS CONSOLE
        </div>

        {dashboardRegistry.map(panel => (
          <div
            key={panel.id}
            onClick={() => setActive(panel.id)}
            style={{
              padding: 10,
              cursor: "pointer",
              background: active === panel.id ? "#1f2937" : "transparent",
              color: "white"
            }}
          >
            {panel.title}
          </div>
        ))}
      </div>

      {/* MAIN VIEW */}
      <div style={{ flex: 1, padding: 16 }}>
        <ActiveComponent />
      </div>
    </div>
  );
}
