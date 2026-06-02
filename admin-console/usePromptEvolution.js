import { useMemo } from "react";

export default function usePromptEvolution(trace) {
  return useMemo(() => {
    if (!trace?.events) return [];

    const evolution = [];

    trace.events.forEach((e, i) => {
      if (
        e.type?.includes("prompt") ||
        e.stage?.includes("router") ||
        e.stage?.includes("ai") ||
        e.payload?.prompt ||
        e.payload?.input
      ) {
        evolution.push({
          id: i,
          stage: e.stage || "unknown",
          raw: e.payload?.rawPrompt || null,
          normalized: e.payload?.normalizedPrompt || null,
          enriched: e.payload?.enrichedPrompt || null,
          final: e.payload?.finalPrompt || null,
          meta: e.payload || {},
          timestamp: e.timestamp || Date.now()
        });
      }
    });

    return evolution.sort((a, b) => a.timestamp - b.timestamp);
  }, [trace]);
}
