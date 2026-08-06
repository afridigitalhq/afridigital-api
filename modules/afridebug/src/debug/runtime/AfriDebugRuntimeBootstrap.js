import Registry from "./AfriDebugRuntimeRegistry.js";
import UnifiedRuntime from "./AfriDebugUnifiedRuntime.js";
import AdminRuntime from "./AfriDebugAdminRuntime.js";

const AfriDebugRuntimeBootstrap = {

  boot(){

    Registry.register(
      "AfriDebugUnifiedRuntime",
      UnifiedRuntime
    );

    Registry.register(
      "AfriDebugAdminRuntime",
      AdminRuntime
    );

    return Registry.health();

  }

};

export default AfriDebugRuntimeBootstrap;
