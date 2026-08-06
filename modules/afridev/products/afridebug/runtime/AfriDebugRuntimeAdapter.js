import CoreRuntimeEngine from "../../../../core/runtime/CoreRuntimeEngine.js";
import CoreRuntimeRegistry from "../../../../core/runtime/CoreRuntimeRegistry.js";

const SERVICE="AfriDebug";

const AfriDebugRuntimeAdapter={
 boot(context={}){
  const runtime=CoreRuntimeEngine.boot(SERVICE,{
   capability:"DEBUG_INVESTIGATION",
   version:"1.0.0",
   ...context
  });

  const registration=CoreRuntimeRegistry.register(SERVICE,runtime);

  return {
   ...runtime,
   registration
  };
 }
};

export default AfriDebugRuntimeAdapter;
