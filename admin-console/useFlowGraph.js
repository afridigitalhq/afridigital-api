import { useMemo } from "react";

export default function useFlowGraph(trace) {
  return useMemo(() => {
    if (!trace?.events) return { nodes: [], edges: [] };

    const nodes = [];
    const edges = [];

    const getOrCreateNode = (id, label, type) => {
      let node = nodes.find((n) => n.id === id);
      if (!node) {
        node = { id, label, type, active: false };
        nodes.push(node);
      }
      return node;
    };

    trace.events.forEach((e, i) => {
      const stage = e.stage || "unknown";
      const type = e.type || "event";

      const from = getOrCreateNode("user", "USER", "user");
      const to = getOrCreateNode(stage, stage.toUpperCase(), type);

      nodes.push(to);

      edges.push({
        id: `edge-${i}`,
        from: from.id,
        to: to.id,
        label: type
      });
    });

    return { nodes, edges };
  }, [trace]);
}
