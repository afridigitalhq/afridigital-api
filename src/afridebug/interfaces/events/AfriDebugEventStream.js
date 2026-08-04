import PlatformBus from "../../platform/events/AfriDebugEventBus.js";

const AfriDebugEventStream = {

  emit(input = {}){

    return PlatformBus.publish({

      type:
        input.type || "UNKNOWN",

      investigationId:
        input.investigationId || null,

      actor:
        input.actor || null,

      details:
        input.details || null

    });

  },


  list(investigationId){

    return PlatformBus.list()
      .filter(
        event =>
          event.investigationId === investigationId
      );

  },


  all(){

    return PlatformBus.list();

  },


  stats(){

    return {

      events:
        PlatformBus.list().length

    };

  }

};


export default AfriDebugEventStream;
