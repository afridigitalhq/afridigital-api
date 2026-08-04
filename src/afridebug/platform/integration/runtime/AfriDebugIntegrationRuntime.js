import Registry from "../registry/AfriDebugIntegrationRegistry.js";
import Subscriber from "../../audit/AfriDebugEventAuditSubscriber.js";

let initialized = false;


const AfriDebugIntegrationRuntime = {

  initialize(){

    if(initialized){

      return {

        initialized:true,

        alreadyInitialized:true,

        modules:
          Registry.list(),

        startedAt:
          Date.now()

      };

    }


    const audit =
      Subscriber.bind();


    initialized = true;


    return {

      initialized:true,

      audit,

      modules:
        Registry.list(),

      startedAt:
        Date.now()

    };

  },


  health(){

    return {

      service:
        "AfriDebugIntegrationRuntime",

      status:
        "healthy",

      initialized,

      modules:
        Registry.stats().modules

    };

  }

};


export default AfriDebugIntegrationRuntime;
