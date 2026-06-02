import { useMemo } from "react";

export default function useMemoryStore(trace) {
  return useMemo(() => {
    if (!trace?.events) return [];

    return trace.events
      .filter((e) =>
        e.type?.includes("memory") ||
        e.stage?.includes("memory") ||
        e.type?.includes("MEMORY")
      )
      .map((e, i) => ({
        id: i,
        action: e.type || "memory-event",
        stage: e.stage,
        payload: e.payload || {},
        timestamp: e.timestamp || Date.now()
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [trace]);
}
