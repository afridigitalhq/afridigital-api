import { useEffect, useMemo, useState } from "react";

/**
 * Incoming WS payload:
 * {
 *   type: "FIELD_DIFF" | "TOPOLOGY",
 *   graph?: { nodes, edges }
 * }
 */

export function useCausalHighlight(wsData) {
  const [activePath, setActivePath] = useState([]);
  const [highlightMap, setHighlightMap] = useState({});

  useEffect(() => {
    if (!wsData?.graph?.edges) return;

    const edges = wsData.graph.edges;

    // Build adjacency list
    const adj = new Map();
    for (const e of edges) {
      if (!adj.has(e.from)) adj.set(e.from, []);
      adj.get(e.from).push(e.to);
    }

    // Pick strongest root (lowest inbound logic assumed upstream)
    const root = wsData.roots?.[0]?.id;
    if (!root) return;

    // BFS propagation path
    const queue = [root];
    const visited = new Set([root]);
    const path = [];

    while (queue.length) {
      const node = queue.shift();
      path.push(node);

      const next = adj.get(node) || [];
      for (const n of next) {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push(n);
        }
      }
    }

    setActivePath(path);

    // Build highlight intensity map
    const map = {};
    path.forEach((id, index) => {
      map[id] = {
        intensity: 1 - index / path.length,
        isSource: index === 0
      };
    });

    setHighlightMap(map);
  }, [wsData]);

  return { activePath, highlightMap };
}
