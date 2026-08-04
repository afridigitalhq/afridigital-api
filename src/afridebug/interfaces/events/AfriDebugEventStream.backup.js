import Storage from "../storage/AfriDebugStorage.js";

const AfriDebugEventStream = {

  emit(input = {}) {

    const data = Storage.get();

    const event = {

      id:`EVENT-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      investigationId:
        input.investigationId || null,

      type:
        input.type || "UNKNOWN",

      actor:
        input.actor || null,

      details:
        input.details || null,

      timestamp:Date.now()
    };

    data.events.push(event);

    Storage.update(data);

    return event;
  },


  list(investigationId){

    return Storage.get().events.filter(
      x=>x.investigationId===investigationId
    );
  },


  all(){

    return Storage.get().events;
  },


  stats(){

    return {
      events:
        Storage.get().events.length
    };
  }

};

export default AfriDebugEventStream;
