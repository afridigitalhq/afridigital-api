import { analyzeRootCause } from "../rca/rootCause";
import { computeHealth } from "./metrics";

export function buildSystemReport(events) {
  return {
    health: computeHealth(events),
    rootCause: analyzeRootCause(events),
    timestamp: Date.now()
  };
}
