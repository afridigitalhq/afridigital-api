import Runtime from "../AfriDebugRealtimeRuntime.js";

const AfriDebugRealtimeGateway={

  open(input={}){

    return Runtime.connect(input);

  },

  stats(){

    return Runtime.stats();

  },

  health(){

    return{

      service:"AfriDebugRealtimeGateway",

      status:"healthy"

    };

  }

};

export default AfriDebugRealtimeGateway;
