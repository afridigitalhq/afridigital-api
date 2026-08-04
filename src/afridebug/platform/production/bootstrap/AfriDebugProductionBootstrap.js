import Registry from "../registry/AfriDebugProductionRegistry.js";

const AfriDebugProductionBootstrap={

  start(){

    return{

      service:"AfriDebugProductionBootstrap",

      modules:Registry.modules(),

      status:"RUNNING",

      startedAt:Date.now()

    };

  },

  health(){

    return{

      service:"AfriDebugProductionBootstrap",

      status:"healthy"

    };

  }

};

export default AfriDebugProductionBootstrap;
