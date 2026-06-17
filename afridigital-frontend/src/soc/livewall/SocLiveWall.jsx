import React from "react";

export default function SocLiveWall({ data }) {
  if (!data) return null;

  const color =
    data.statusClass === "DANGER" ? "#ff3b3b" :
    data.statusClass === "WARNING" ? "#ffaa00" :
    "#00ff88";

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#05060a",
      color: "#ccc",
      fontFamily: "monospace",
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gridTemplateRows: "1fr 1fr",
      gap: "10px",
      padding: "12px"
    }}>

      {/* SYSTEM PULSE */}
      <div style={{ border: "1px solid #222", padding: 10 }}>
        <h2 style={{ color }}>SYSTEM PULSE</h2>
        <div>State: {data.systemPulse.state}</div>
        <div>Success: {data.systemPulse.successRate}%</div>
        <div>Risk: {data.systemPulse.risk}</div>
      </div>

      {/* THREATS */}
      <div style={{ border: "1px solid #222", padding: 10 }}>
        <h2 style={{ color: "#ff3b3b" }}>THREAT MATRIX</h2>
        <div>Alerts: {data.threatMatrix.alerts}</div>
        <div>Anomalies: {data.threatMatrix.anomalies}</div>
        <div>Security: {data.threatMatrix.securityLevel}</div>
      </div>

      {/* ROOT CAUSE */}
      <div style={{ border: "1px solid #222", padding: 10 }}>
        <h2 style={{ color: "#00c2ff" }}>ROOT CAUSE INTEL</h2>
        <div>{data.intelligenceFeed.rootCause?.type || "NONE"}</div>
        <div>{data.intelligenceFeed.rootCause?.explanation || "SYSTEM NORMAL"}</div>
      </div>

      {/* INCIDENTS */}
      <div style={{ border: "1px solid #222", padding: 10 }}>
        <h2 style={{ color: "#ffaa00" }}>INCIDENT RESPONSE</h2>
        <div>{data.intelligenceFeed.recommendation}</div>
      </div>

      {/* FEDERATION */}
      <div style={{ border: "1px solid #222", padding: 10 }}>
        <h2 style={{ color: "#9b59b6" }}>CLUSTER FEDERATION</h2>
        <div>Nodes: {data.clusterView.globalNodes}</div>
        <div>Health: {data.clusterView.health}</div>
      </div>

      {/* STATUS STRIP */}
      <div style={{
        gridColumn: "1 / span 3",
        border: "1px solid #222",
        padding: 10,
        textAlign: "center",
        color
      }}>
        LIVE SOC STATUS: {data.statusClass}
      </div>

    </div>
  );
}
