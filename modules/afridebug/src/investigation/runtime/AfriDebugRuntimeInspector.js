import { collectRuntimeEvents } from "./events/AfriDebugRuntimeEventCollector.js";
import { generateRuntimeEvidence } from "./evidence/AfriDebugRuntimeEvidenceAdapter.js";

export function inspectRuntime() {
  console.log("\n⚡ AfriDebug Runtime Inspector\n");

  const events = collectRuntimeEvents();

  const evidence = generateRuntimeEvidence(events);

  return evidence;
}
