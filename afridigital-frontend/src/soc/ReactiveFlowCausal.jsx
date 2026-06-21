import React, { useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import { useCausalHighlight } from "./useCausalHighlight";

export default function ReactiveFlowCausal({ graph }) {
  const { highlightMap } = useCausalHighlight(graph);

  const nodes = useMemo(() => {
    return (graph?.nodes || []).map(n => {
      const h = highlightMap[n.id];

      return {
        id: n.id,
        position: {
          x: (n.heat || 1) * 80,
          y: (n.velocity || 1) * 60
        },
        data: {
          label: h?.isSource ? "🔥 ROOT CAUSE" : n.service || "node"
        },
        style: {
          opacity: h ? 1 : 0.2,
          transform: h ? `scale(${1 + (h.intensity || 0)})` : "scale(0.9)",
          border: h?.isSource
            ? "2px solid red"
            : "1px solid rgba(255,255,255,0.1)",
          boxShadow: h
            ? `0 0 ${20 * h.intensity}px rgba(255,0,0,0.6)`
            : "none"
        }
      };
    });
  }, [graph, highlightMap]);

  const edges = useMemo(() => {
    return (graph?.edges || []).map(e => {
      const active = highlightMap[e.from] && highlightMap[e.to];

      return {
        id: `${e.from}-${e.to}`,
        source: e.from,
        target: e.to,
        animated: !!active,
        style: {
          stroke: active ? "red" : "#333",
          strokeWidth: active ? 2 : 1,
          opacity: active ? 1 : 0.2
        }
      };
    });
  }, [graph, highlightMap]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
