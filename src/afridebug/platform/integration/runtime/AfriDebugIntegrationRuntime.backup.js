import Registry from "../registry/AfriDebugIntegrationRegistry.js";

const AfriDebugIntegrationRuntime={

  initialize(){

    return{

      initialized:true,

      modules:Registry.list(),

      startedAt:Date.now()

    };

  },

  health(){

    return{

      service:"AfriDebugIntegrationRuntime",

      status:"healthy",

      modules:Registry.stats().modules

    };

  }

};

export default AfriDebugIntegrationRuntime;
