import { runInvestigationPipeline } from "./AfriDebugInvestigationPipeline.js";

export async function startAfriDebugInvestigation() {
  console.log("🧠 AfriDebug Investigation Orchestrator");
  console.log("================================");

  const result = await runInvestigationPipeline();

  console.log("================================");
  console.log(result
    ? "🟢 Investigation Completed"
    : "🔴 Investigation Failed"
  );

  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startAfriDebugInvestigation();
}
