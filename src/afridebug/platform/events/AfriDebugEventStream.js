import RuntimeStorage from "../storage/AfriDebugRuntimeStorage.js";

const FILE="events/events.json";

const AfriDebugEventStream = {

  load(){

    return RuntimeStorage.read(
      FILE,
      []
    );

  },


  save(events){

    return RuntimeStorage.write(
      FILE,
      events
    );

  },


  emit(event = {}){

    const events=this.load();

    const record={
      id:`EVENT-${Date.now()}`,
      ...event,
      createdAt:Date.now()
    };

    events.push(record);

    this.save(events);

    return record;

  },


  list(investigationId){

    const events=this.load();

    return events.filter(
      event=>event.investigationId===investigationId
    );

  }

};

export default AfriDebugEventStream;
