import ClientStatus from "../../marketplace/client/AfriDebugClientStatusRuntime.js";

const AfriDebugClientAPI = {

  register(input = {}){

    return ClientStatus.register(input);

  },

  get(id){

    return ClientStatus.get(id);

  },

  stats(){

    return ClientStatus.stats();

  },

  health(){

    return {

      service:"AfriDebugClientAPI",

      status:"healthy"

    };

  }

};

export default AfriDebugClientAPI;
