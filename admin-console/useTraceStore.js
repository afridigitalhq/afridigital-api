import { useMemo } from "react";

export default function useTraceStore(events) {
  return useMemo(() => {
    const traces = {};

    events.forEach((e) => {
      const id = e.payload?.traceId || "unknown";

      if (!traces[id]) {
        traces[id] = {
          id,
          events: []
        };
      }

      traces[id].events.push(e);
    });

    return Object.values(traces).sort(
      (a, b) => b.events.length - a.events.length
    );
  }, [events]);
}
