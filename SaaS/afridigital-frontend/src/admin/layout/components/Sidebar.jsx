import React from "react";
import { plugins } from "../../plugins/registry";

export default function Sidebar() {
  return (
    <div style={{
      width: 240,
      background: "#111827",
      padding: 12,
      color: "white"
    }}>
      <h3>⚡ Admin</h3>

      {plugins.map(p => (
        <div key={p.id} style={{ margin: "10px 0" }}>
          <a href={p.route} style={{ color: "#60a5fa" }}>
            {p.label}
          </a>
        </div>
      ))}
    </div>
  );
}
