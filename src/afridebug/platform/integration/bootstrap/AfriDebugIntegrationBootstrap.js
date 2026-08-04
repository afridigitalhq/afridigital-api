import Runtime from "../runtime/AfriDebugIntegrationRuntime.js";

const AfriDebugIntegrationBootstrap={

  boot(){

    return Runtime.initialize();

  }

};

export default AfriDebugIntegrationBootstrap;
