import React, { useState } from "react";
import useControlPlaneStream from "./useControlPlaneStream";

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState("overview");
  const events = useControlPlaneStream();

  return (
    <div style={styles.app}>

      <div style={styles.topBar}>
        <div style={styles.topLeft}>🧠 AfriAI Control Plane</div>

        <div style={styles.topCenter}>
          <StatusDot /> Live Brain Active
        </div>

        <div style={styles.topRight}>
          Events: {events.length} | Stream: ACTIVE
        </div>
      </div>

      <div style={styles.body}>

        <div style={styles.sidebar}>
          <SidebarItem label="Overview" active={activeTab==="overview"} onClick={()=>setActiveTab("overview")} />
          <SidebarItem label="Trace Stream" active={activeTab==="traces"} onClick={()=>setActiveTab("traces")} />
          <SidebarItem label="Flow Graph" active={activeTab==="flow"} onClick={()=>setActiveTab("flow")} />
          <SidebarItem label="Memory" active={activeTab==="memory"} onClick={()=>setActiveTab("memory")} />
          <SidebarItem label="Decisions" active={activeTab==="decisions"} onClick={()=>setActiveTab("decisions")} />
        </div>

        <div style={styles.main}>

          {/* LIVE STREAM CORE */}
          <div style={styles.stream}>
            <h3>⚡ Live Control Plane Stream</h3>

            {events.slice(0, 20).map((e, i) => (
              <div key={i} style={{ fontSize: 12, padding: 4 }}>
                <b style={{ color: "#00F5FF" }}>{e.type}</b>{" "}
                <span style={{ opacity: 0.7 }}>{e.stage}</span>{" "}
                <span style={{ opacity: 0.5 }}>{e.traceId}</span>
              </div>
            ))}
          </div>

          {/* FLOW VIEW PLACEHOLDER */}
          {activeTab === "flow" && (
            <div style={styles.flow}>
              <h3>🔄 System Flow Graph</h3>
              <div>Live request → AI → memory → response visualization</div>
            </div>
          )}

          {/* MEMORY VIEW */}
          {activeTab === "memory" && (
            <div style={styles.stream}>
              <h3>🧠 Memory Inspector</h3>
              <div>State snapshots streaming here...</div>
            </div>
          )}

          {/* DECISION VIEW */}
          {activeTab === "decisions" && (
            <div style={styles.stream}>
              <h3>🧭 Decision Reasoning</h3>
              <div>AI reasoning traces will appear here...</div>
            </div>
          )}

        </div>

        <div style={styles.inspector}>
          <h3>📡 Inspector</h3>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            Click events to inspect trace details
          </div>
        </div>

      </div>
    </div>
  );
}

/* keep your existing components + styles below unchanged */
