import PlatformBus from "../../platform/events/AfriDebugEventBus.js";

const AfriDebugEventBus = {

  on(event, handler){

    return PlatformBus.subscribe(
      event,
      handler
    );

  },


  emit(event, payload = {}){

    return PlatformBus.publish({

      type:event,

      payload

    });

  },


  history(){

    return PlatformBus.list();

  },


  events(){

    return [
      ...new Set(
        PlatformBus.list()
        .map(item=>item.type)
      )
    ];

  }

};


export default AfriDebugEventBus;
