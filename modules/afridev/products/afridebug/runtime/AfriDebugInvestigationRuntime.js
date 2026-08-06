import AfriDebugEvidenceIntake from "../investigation/intake/AfriDebugEvidenceIntake.js";
import AfriDebugDependencyGraph from "../dependency/AfriDebugDependencyGraph.js";
import AfriDebugRuntime from "./AfriDebugRuntime.js";
import AfriDebugLogCollector from "../intake/AfriDebugLogCollector.js";
import AfriDebugIntelligenceAdapter from "../intelligence/AfriDebugIntelligenceAdapter.js";
import AfriDebugPatchGenerator from "../patch/AfriDebugPatchGenerator.js";
import AfriDebugPatchValidator from "../patch/AfriDebugPatchValidator.js";
import AfriDebugTestBridge from "../integration/AfriDebugTestBridge.js";
import AfriDebugDeliveryAdapter from "../delivery/AfriDebugDeliveryAdapter.js";

const AfriDebugInvestigationRuntime={
 investigate(repository){
  const intake=AfriDebugEvidenceIntake.collect(repository);
  const dependency=AfriDebugDependencyGraph.build(repository);
  const runtime=AfriDebugRuntime.boot();
  const logs=AfriDebugLogCollector.collect(repository);
  const intelligence=AfriDebugIntelligenceAdapter.investigate(logs,{
   repository,
   runtime
  });
  const stack=intelligence;
  const knowledge=AfriDebugIntelligenceAdapter.patterns(stack,[]);
  const rootCause=AfriDebugIntelligenceAdapter.reason(knowledge);
  const plan=AfriDebugIntelligenceAdapter.recommend(rootCause);
  const patch=AfriDebugPatchGenerator.generate(plan);
  const validation=AfriDebugPatchValidator.validate(patch);
  const tests=AfriDebugTestBridge.execute(validation);
  const report=AfriDebugDeliveryAdapter.generate(repository);

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
