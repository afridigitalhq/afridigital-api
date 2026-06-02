import { useMemo } from "react";

export default function useSelfDiagnostic(trace) {
  return useMemo(() => {
    if (!trace?.events) return null;

    const events = trace.events;

    const hasError =
      events.some(e =>
        e.type?.includes("error") ||
        e.type?.includes("fail") ||
        e.stage?.includes("error") ||
        e.payload?.error
      );

    if (!hasError) {
      return {
        status: "healthy",
        message: "No anomalies detected in execution trace"
      };
    }

    const errorEvent = [...events].reverse().find(e =>
      e.type?.includes("error") ||
      e.payload?.error
    );

    const lastValid = [...events].reverse().find(e =>
      !e.type?.includes("error") && !e.payload?.error
    );

    const failureType = (() => {
      if (errorEvent?.stage?.includes("router")) return "Routing Failure";
      if (errorEvent?.stage?.includes("ai")) return "AI Execution Failure";
      if (errorEvent?.stage?.includes("memory")) return "Memory Failure";
      if (errorEvent?.stage?.includes("pipeline")) return "Pipeline Breakdown";
      return "Unknown System Failure";
    })();

    const rootCause = {
      failedAt: errorEvent?.stage || "unknown",
      lastSuccessfulStage: lastValid?.stage || "unknown",
      reason: errorEvent?.payload?.error || errorEvent?.reason || "unclassified failure signal"
    };

    const impact = events.filter(e =>
      e.timestamp >= errorEvent?.timestamp
    );

    return {
      status: "degraded",
      failureType,
      rootCause,
      impactSummary: {
        affectedStages: impact.map(i => i.stage),
        eventCount: impact.length
      },
      suggestedFix: generateFix(failureType, rootCause)
    };

  }, [trace]);
}

function generateFix(type, rootCause) {
  switch (type) {
    case "Routing Failure":
      return "Check route mapping table + verify middleware chain order";
    case "AI Execution Failure":
      return "Inspect prompt payload + model call wrapper + token limits";
    case "Memory Failure":
      return "Validate memory store hydration + cache consistency layer";
    case "Pipeline Breakdown":
      return "Inspect eventBus emission chain + missing listeners";
    default:
      return `Inspect stage: ${rootCause.failedAt}`;
  }
}
