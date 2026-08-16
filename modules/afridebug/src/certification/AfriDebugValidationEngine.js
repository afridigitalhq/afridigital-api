
import { validate as bootstrapValidate } from "./AfriDebugBootstrapValidator.js";
import { validate as moduleValidate } from "./AfriDebugModuleRegistryValidator.js";
import { validate as pluginValidate } from "./AfriDebugPluginValidator.js";
import { validate as routeValidate } from "./AfriDebugRouteValidator.js";
import { validate as runtimeValidate } from "./AfriDebugRuntimeValidator.js";
import { generateEvidence } from "./AfriDebugEvidenceGenerator.js";
import { generateReport } from "./AfriDebugCertificationReport.js";
import { validateInvestigation } from "./AfriDebugInvestigationValidator.js";
import { buildDependencyGraph } from "../investigation/AfriDebugDependencyGraphBuilder.js";
import { inspectRuntime } from "../investigation/runtime/AfriDebugRuntimeInspector.js";
import { analyzeLogs } from "../investigation/logs/AfriDebugLogAnalyzer.js";
import { matchKnowledge } from "../investigation/knowledge/AfriDebugKnowledgeMatcher.js";
import { planPatch } from "../investigation/patch/AfriDebugPatchPlanner.js";
import { verifyPatch } from "../verification/AfriDebugVerificationEngine.js";
import { assembleDelivery } from "../delivery/AfriDebugDeliveryAssembler.js";
import { analyzeImpact } from "../intelligence/AfriDebugImpactAnalyzer.js";
import { generateChangeSummary } from "../intelligence/AfriDebugChangeSummaryGenerator.js";
import { scoreConfidence } from "../intelligence/AfriDebugConfidenceScorer.js";
import { validateIntake } from "../debug/intake/AfriDebugIntakeValidator.js";
import CoreApprovalContract from "../../../../modules/core/approval/CoreApprovalContract.js";

async function runValidation(){

  console.log("🚀 AfriDebug Validation Engine");
  console.log("================================");

  const stages = [
    ["Bootstrap", () => bootstrapValidate()],
    ["Module Registry", () => moduleValidate()],
    ["Plugin", () => pluginValidate()],
    ["Route", () => routeValidate()],
    ["Runtime", () => runtimeValidate()],
    ["Dependency Graph", () => buildDependencyGraph()],
    ["Runtime Inspection", () => inspectRuntime()],
    ["Log Analysis", () => analyzeLogs()],
    ["Knowledge Matching", () => matchKnowledge()],
    ["Patch Planning", () => planPatch()],
    ["Verification", () => verifyPatch()],
    ["Approval Contract", () => {
      const pending = CoreApprovalContract.request({
        source: "AfriDebugValidationEngine",
        subjectType: "repair"
      });
      const approved = CoreApprovalContract.approve(
        pending,
        "validation-test"
      );
      return (
        CoreApprovalContract.canExecute(approved) &&
        CoreApprovalContract.canExecute(pending) === false
      );
    }],
    ["Delivery Assembly", () => assembleDelivery()],
    ["Impact Analysis", () => analyzeImpact()],
    ["Change Summary", () => generateChangeSummary()],
    ["Confidence", () => scoreConfidence()],
    ["Intake", () => validateIntake()],
    ["Investigation", () => validateInvestigation()],
    ["Evidence", () => generateEvidence()],
    ["Certification Report", () => generateReport()]
  ];

  let passed = true;

  for (const [name, validator] of stages) {
    console.log(`\\n=== ${name.toUpperCase()} ===`);

    try {
      const result = await validator();

      if (!result) {
        passed = false;
        console.log(`🔴 ${name} FAILED`);
        break;
      }

      console.log(`🟢 ${name} PASSED`);
    } catch (error) {
      passed = false;
      console.error(`🔴 ${name} FAILED`);
      console.error(error?.stack || error);
      break;
    }
  }

  console.log("================================");
  console.log(
    passed
      ? "🟢 AfriDebug Certification PASSED"
      : "🔴 AfriDebug Certification FAILED"
  );
  console.log("================================");

  process.exit(passed ? 0 : 1);
}
runValidation();