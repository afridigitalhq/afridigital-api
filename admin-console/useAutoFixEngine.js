import { useMemo } from "react";

export default function useAutoFixEngine(trace, diagnosis) {
  return useMemo(() => {
    if (!diagnosis || diagnosis.status !== "degraded") return null;

    const riskLevel = evaluateRisk(diagnosis);

    return {
      mode: "PROPOSE_ONLY",
      riskLevel,
      patch: generatePatch(diagnosis),
      explanation: generateExplanation(diagnosis),
      requiresApproval: riskLevel >= 2
    };
  }, [trace, diagnosis]);
}

function evaluateRisk(d) {
  if (d.failureType === "Routing Failure") return 1;
  if (d.failureType === "AI Execution Failure") return 2;
  if (d.failureType === "Memory Failure") return 2;
  return 3;
}

function generatePatch(d) {
  return {
    type: d.failureType,
    suggestion:
      d.failureType === "Routing Failure"
        ? "Verify route registration order and middleware chaining"
        : d.failureType === "AI Execution Failure"
        ? "Add prompt validation + token guardrails"
        : "Add defensive fallback handler"
  };
}

function generateExplanation(d) {
  return `System detected ${d.failureType} at ${d.rootCause?.failedAt}. 
Suggested fix targets the last stable stage: ${d.rootCause?.lastSuccessfulStage}`;
}
