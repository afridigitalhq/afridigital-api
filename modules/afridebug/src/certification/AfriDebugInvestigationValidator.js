import { startAfriDebugInvestigation } from "../orchestrator/AfriDebugInvestigationOrchestrator.js";

export async function validateInvestigation() {
  console.log("\n🧠 Investigation Validation\n");

  const result = await startAfriDebugInvestigation();

  console.log(
    result
      ? "🟢 Investigation Runtime PASSED"
      : "🔴 Investigation Runtime FAILED"
  );

  return result;
}
