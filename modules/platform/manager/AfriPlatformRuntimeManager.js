import AfriPlatformRuntime from "../runtime/AfriPlatformRuntime.js";
import AfriPlatformModuleLoader from "../loader/AfriPlatformModuleLoader.js";

const AfriPlatformRuntimeManager = {
  start(){
    return {
      runtime: AfriPlatformRuntime.boot(),
      modules: AfriPlatformModuleLoader.load(),
      status: "RUNNING"
    };
  }
};

export default AfriPlatformRuntimeManager;
