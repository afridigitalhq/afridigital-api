import AfriDebugIntakeAdapter from "../intake/AfriDebugIntakeAdapter.js";
import AfriSecurityRuntime from "../../../../afrisecurity/runtime/AfriSecurityRuntime.js";
import AfriDebugScanAdapter from "../adapters/AfriDebugScanAdapter.js";
import AfriDebugDependencyAdapter from "../dependency/AfriDebugDependencyAdapter.js";
import AfriDebugRuntime from "./AfriDebugRuntime.js";

import AfriDebugIntelligenceAdapter from "../intelligence/AfriDebugIntelligenceAdapter.js";
import AfriDebugPatchGenerator from "../patch/AfriDebugPatchGenerator.js";
import AfriDebugPatchAdapter from "../patch/AfriDebugPatchAdapter.js";
import AfriDebugTestBridge from "../integration/AfriDebugTestBridge.js";
import AfriDebugDeliveryAdapter from "../delivery/AfriDebugDeliveryAdapter.js";
import AfriDebugPipelineAdapter from "../orchestration/AfriDebugPipelineAdapter.js";
import AfriDebugWorkflow from "../investigation/AfriDebugWorkflow.js";

const AfriDebugInvestigationRuntime={
 investigate(repository){
  const pipeline=AfriDebugPipelineAdapter.run(AfriDebugWorkflow.stages,{repository});
  const intake=AfriDebugIntakeAdapter.repository(repository);
  const scan=AfriDebugScanAdapter.scan(repository);
  const dependency=AfriDebugDependencyAdapter.build(repository);
  const runtime=AfriDebugRuntime.boot();
  const logs=AfriDebugIntakeAdapter.logs(repository);
  const intelligence=AfriDebugIntelligenceAdapter.investigate(logs,{repository,runtime});
  const analysis=AfriDebugIntelligenceAdapter.analyze(intelligence);
  const stack=intelligence;
  const knowledge=AfriDebugIntelligenceAdapter.patterns(analysis,[]);
  const rootCause=AfriDebugIntelligenceAdapter.reason(knowledge);
  const plan=AfriDebugIntelligenceAdapter.recommend(rootCause);
  const patch=AfriDebugPatchGenerator.generate(plan);
  const applied=AfriDebugPatchAdapter.apply(repository,patch);
  const validation=AfriDebugPatchAdapter.validate(applied);
  const tracking=AfriDebugPatchAdapter.track({repository,diff:AfriDebugPatchAdapter.diff({},applied),applied,validation});
  const tests=AfriDebugTestBridge.execute(validation);
  const report=AfriDebugDeliveryAdapter.generate(repository);

  return {
   security,
   pipeline,
   intake,
   scan,
   dependency,
   runtime,
   logs,
   stack,
   analysis,
   knowledge,
   rootCause,
   plan,
   patch,
   applied,
   validation,
   tracking,
   tests,
   report,
   status:"INVESTIGATION_COMPLETED"
  };
 }
};

export default AfriDebugInvestigationRuntime;
