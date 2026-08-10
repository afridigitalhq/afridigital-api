import RuntimeConfig from "./RuntimeConfig.js";
import RuntimeDependencies from "./RuntimeDependencies.js";
import RuntimeLifecycle from "./RuntimeLifecycle.js";

const RuntimeRegistry = {
  load(){
    return {
      config: RuntimeConfig,
      dependencies: RuntimeDependencies.load(),
      lifecycle: RuntimeLifecycle
    };
  }
};

export default RuntimeRegistry;
