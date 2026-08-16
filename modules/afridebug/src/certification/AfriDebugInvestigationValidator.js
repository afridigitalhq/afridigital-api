import AfriDebugOrchestrator from "../../../src/afridebug/platform/orchestration/AfriDebugInvestigationOrchestrator.js";
import InvestigationRegistry from "../debug/investigation/AfriDebugInvestigationRegistry.js";

export async function validateInvestigation() {
  console.log("\n🧠 Investigation Validation\n");

  const orchestratorValid =
    AfriDebugOrchestrator &&
    typeof AfriDebugOrchestrator.run === "function";

  const registryValid =
    InvestigationRegistry &&
    typeof InvestigationRegistry.list === "function" &&
    typeof InvestigationRegistry.has === "function" &&
    InvestigationRegistry.has("RepositoryIntake") &&
    InvestigationRegistry.has("DependencyGraphBuilder") &&
    InvestigationRegistry.has("RuntimeInspector") &&
    InvestigationRegistry.has("LogAnalyzer") &&
    InvestigationRegistry.has("KnowledgeMatcher") &&
    InvestigationRegistry.has("PatchPlanner") &&
    InvestigationRegistry.has("VerificationEngine") &&
    InvestigationRegistry.has("EvidenceReportGenerator") &&
    InvestigationRegistry.has("DeliveryPackager");

  const passed = Boolean(
    orchestratorValid &&
    registryValid
  );

  console.log(
    passed
      ? "🟢 Investigation Runtime Contract PASSED"
      : "🔴 Investigation Runtime Contract FAILED"
  );

  return passed;
}
