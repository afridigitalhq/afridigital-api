import Registry from "../registry/AfriDebugAPIRegistry.js";

const AfriDebugAPIRouter = {

  resolve(name){

    return Registry.get(name);

  },

  routes(){

    return Registry.list();

  },

  health(){

    return {

      service:"AfriDebugAPIRouter",

      status:"healthy"

    };

  }

};

export default AfriDebugAPIRouter;
