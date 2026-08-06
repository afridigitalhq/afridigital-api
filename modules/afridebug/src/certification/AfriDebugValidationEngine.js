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
import { requestApproval } from "../delivery/AfriDebugApprovalGate.js";
import { assembleDelivery } from "../delivery/AfriDebugDeliveryAssembler.js";
import { analyzeImpact } from "../intelligence/AfriDebugImpactAnalyzer.js";
import { generateChangeSummary } from "../intelligence/AfriDebugChangeSummaryGenerator.js";
import { scoreConfidence } from "../intelligence/AfriDebugConfidenceScorer.js";

async function runValidation(){

console.log("🚀 AfriDebug Validation Engine");
console.log("================================");

const results = [
  bootstrapValidate(),
  moduleValidate(),
  pluginValidate(),
  routeValidate(),
  runtimeValidate(),
  buildDependencyGraph(),
  inspectRuntime(),
  analyzeLogs(),
  matchKnowledge(),
  planPatch(),
  verifyPatch(),
  requestApproval(),
  assembleDelivery(),
  analyzeImpact(),
  generateChangeSummary(),
  scoreConfidence(),
  await validateInvestigation(),
  generateEvidence(),
  generateReport()
];

const passed = results.every(Boolean);

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