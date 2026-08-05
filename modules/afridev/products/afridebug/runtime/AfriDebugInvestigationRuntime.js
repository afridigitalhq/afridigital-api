import AfriDebugEvidenceIntake from "../investigation/intake/AfriDebugEvidenceIntake.js";
import AfriDebugDependencyGraph from "../dependency/AfriDebugDependencyGraph.js";
import AfriDebugRuntime from "./AfriDebugRuntime.js";
import AfriDebugLogCollector from "../intake/AfriDebugLogCollector.js";
import AfriDebugStackTraceAnalyzer from "../ai/AfriDebugStackTraceAnalyzer.js";
import AfriDebugKnowledgeMatcher from "../ai/AfriDebugKnowledgeMatcher.js";
import AfriDebugRootCauseAnalyzer from "../ai/AfriDebugRootCauseAnalyzer.js";
import AfriDebugPatchAdvisor from "../ai/AfriDebugPatchAdvisor.js";
import AfriDebugPatchGenerator from "../patch/AfriDebugPatchGenerator.js";
import AfriDebugPatchValidator from "../patch/AfriDebugPatchValidator.js";
import AfriDebugTestBridge from "../integration/AfriDebugTestBridge.js";
import AfriDebugReportGenerator from "../delivery/AfriDebugReportGenerator.js";

const AfriDebugInvestigationRuntime={
 investigate(repository){
  const intake=AfriDebugEvidenceIntake.collect(repository);
  const dependency=AfriDebugDependencyGraph.build(repository);
  const runtime=AfriDebugRuntime.boot();
  const logs=AfriDebugLogCollector.collect(repository);
  const stack=AfriDebugStackTraceAnalyzer.analyze(logs);
  const knowledge=AfriDebugKnowledgeMatcher.match(stack);
  const rootCause=AfriDebugRootCauseAnalyzer.analyze(knowledge);
  const plan=AfriDebugPatchAdvisor.suggest(rootCause);
  const patch=AfriDebugPatchGenerator.generate(plan);
  const validation=AfriDebugPatchValidator.validate(patch);
  const tests=AfriDebugTestBridge.execute(validation);
  const report=AfriDebugReportGenerator.generate(repository);

  return {
   intake,
   dependency,
   runtime,
   logs,
   stack,
   knowledge,
   rootCause,
   plan,
   patch,
   validation,
   tests,
   report,
   status:"INVESTIGATION_COMPLETED"
  };
 }
};

export default AfriDebugInvestigationRuntime;
