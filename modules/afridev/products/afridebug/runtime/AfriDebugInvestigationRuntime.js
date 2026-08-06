import AfriDebugIntakeAdapter from "../intake/AfriDebugIntakeAdapter.js";
import AfriDebugDependencyAdapter from "../dependency/AfriDebugDependencyAdapter.js";
import AfriDebugRuntime from "./AfriDebugRuntime.js";

import AfriDebugIntelligenceAdapter from "../intelligence/AfriDebugIntelligenceAdapter.js";
import AfriDebugPatchGenerator from "../patch/AfriDebugPatchGenerator.js";
import AfriDebugPatchAdapter from "../patch/AfriDebugPatchAdapter.js";
import AfriDebugTestBridge from "../integration/AfriDebugTestBridge.js";
import AfriDebugDeliveryAdapter from "../delivery/AfriDebugDeliveryAdapter.js";

const AfriDebugInvestigationRuntime={
 investigate(repository){
  const intake=AfriDebugIntakeAdapter.repository(repository);
  const dependency=AfriDebugDependencyAdapter.build(repository);
  const runtime=AfriDebugRuntime.boot();
  const logs=AfriDebugIntakeAdapter.logs(repository);
  const intelligence=AfriDebugIntelligenceAdapter.investigate(logs,{
   repository,
   runtime
  });
  const stack=intelligence;
  const knowledge=AfriDebugIntelligenceAdapter.patterns(stack,[]);
  const rootCause=AfriDebugIntelligenceAdapter.reason(knowledge);
  const plan=AfriDebugIntelligenceAdapter.recommend(rootCause);
  const patch=AfriDebugPatchGenerator.generate(plan);
  const validation=AfriDebugPatchAdapter.validate(patch);
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
