import React from "react";

export default function V12VisualPanel({ dag = {}, heatmap = [] }) {
  return (
    <div style={{ padding: 12 }}>
      <h3>V12.5 VISUAL ENGINE</h3>
      <div>DAG: {dag?.nodes?.length || 0}</div>
      <pre>{JSON.stringify(heatmap, null, 2)}</pre>
    </div>
  );
}
