const modules={

  investigation:"../../investigation/AfriDebugInvestigationRuntime.js",

  orchestrator:"../../orchestration/AfriDebugInvestigationOrchestrator.js",

  api:"../../api/AfriDebugAPIRegistry.js",

  realtime:"../../realtime/AfriDebugRealtimeRuntime.js",

  enterprise:"../../enterprise/runtime/AfriDebugEnterpriseRuntime.js",

  production:"../../production/bootstrap/AfriDebugProductionBootstrap.js"

};

const AfriDebugIntegrationRegistry={

  list(){

    return modules;

  },

  stats(){

    return{

      modules:Object.keys(modules).length

    };

  }

};

export default AfriDebugIntegrationRegistry;
