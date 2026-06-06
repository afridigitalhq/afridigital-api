import React from "react";

export default function FlowGraphWindow({ nodes = [] }) {
  return (
    <div>
      <h3>🧠 FlowGraph</h3>
      {nodes.map((n, i) => (
        <div key={i} style={{ fontSize: 12 }}>
          {n.id || JSON.stringify(n)}
        </div>
      ))}
    </div>
  );
}
