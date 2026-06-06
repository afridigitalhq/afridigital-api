import React from "react";

export default function FlowNode({ node }) {

  const color =
    node.type === "EVENT" ? "#0ff" :
    node.type === "PREDICTION" ? "#f0f" :
    "#fff";

  return (
    <div style={{
      border: `1px solid ${color}`,
      padding: 10,
      margin: 5,
      borderRadius: 6,
      background: "#0b1020"
    }}>
      <strong>{node.type}</strong>
      <div>{node.label}</div>
      <div style={{ fontSize: 10, opacity: 0.7 }}>
        {node.time}
      </div>
    </div>
  );
}
