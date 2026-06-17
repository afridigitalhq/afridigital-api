import React from "react";
import { useAdminLiveDag } from "./useAdminLiveDag";

export default function LiveDagAutoPanel() {
  const nodes = useAdminLiveDag();

  return (
    <div style={{ padding: 12 }}>
      <h3>🔴 Live DAG (Render Stream)</h3>
      <div>Nodes: {nodes.length}</div>

      <div style={{ marginTop: 10 }}>
        {nodes.map((n) => (
          <div key={n.id}>
            {n.status} — {n.id}
          </div>
        ))}
      </div>
    </div>
  );
}
