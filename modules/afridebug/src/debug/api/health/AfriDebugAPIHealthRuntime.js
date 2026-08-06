import Registry from "../registry/AfriDebugAPIRegistry.js";

const AfriDebugAPIHealthRuntime = {

  check(){

    return {

      success:true,

      registered:Registry.stats().apis,

      status:"HEALTHY"

    };

  },

  health(){

    return {

      service:"AfriDebugAPIHealthRuntime",

      status:"healthy"

    };

  }

};

export default AfriDebugAPIHealthRuntime;
