import CoreRuntimeEngine from "../../../../core/runtime/CoreRuntimeEngine.js";
import CoreRuntimeRegistry from "../../../../core/runtime/CoreRuntimeRegistry.js";
import CoreDelegationEngine from "../../../../core/delegation/CoreDelegationEngine.js";

const SERVICE="AfriDebug";

const AfriDebugRuntimeAdapter={
 boot(context={}){
  const runtime=CoreRuntimeEngine.boot(SERVICE,{
   capability:"DEBUG_INVESTIGATION",
   version:"1.0.0",
   ...context
  });

  const registration=CoreRuntimeRegistry.register(SERVICE,runtime);
    const delegation=CoreDelegationEngine.register("DEBUG_INVESTIGATION", async (plan)=>{
      const { default: AfriDebugInvestigationRuntime } = await import("./AfriDebugInvestigationRuntime.js");
      return AfriDebugInvestigationRuntime.investigate(plan.task?.repository, plan.task?.options || {});
    });

  return {
   ...runtime,
   registration
  };
 }
};

export default AfriDebugRuntimeAdapter;
