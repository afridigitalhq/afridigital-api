import { useMemo } from "react";

export default function useDecisionStore(trace) {
  return useMemo(() => {
    if (!trace?.events) return [];

    return trace.events
      .filter((e) =>
        e.type?.includes("route") ||
        e.type?.includes("decision") ||
        e.type?.includes("select") ||
        e.type?.includes("choose") ||
        e.stage?.includes("router") ||
        e.stage?.includes("ai") ||
        e.reason ||
        e.decision
      )
      .map((e, i) => ({
        id: i,
        stage: e.stage,
        decision: e.decision || e.type,
        reason: e.reason || e.payload?.reason || "no explicit reason logged",
        confidence: e.payload?.confidence ?? null,
        alternatives: e.payload?.alternatives || [],
        payload: e.payload || {}
      }));
  }, [trace]);
}
