import { analyzeRootCause } from "./rootCause";

export function runRCA(events) {
  const report = analyzeRootCause(events);

  return {
    ...report,
    timestamp: Date.now(),
    mode: "read-only-analysis"
  };
}
