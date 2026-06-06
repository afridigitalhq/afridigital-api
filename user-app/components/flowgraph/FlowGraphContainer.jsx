import React from "react";
import FlowNode from "./FlowNode";

export default function FlowGraphContainer({ nodes }) {

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {nodes.map((n, i) => (
        <FlowNode key={i} node={n} />
      ))}
    </div>
  );
}
