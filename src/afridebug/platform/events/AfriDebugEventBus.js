const events = [];
const subscribers = {};

const AfriDebugEventBus = {

  publish(event = {}) {

    const record = {
      id:`BUS-EVENT-${Date.now()}`,
      ...event,
      createdAt:Date.now()
    };

    events.push(record);

    const listeners =
      subscribers[event.type] || [];

    listeners.forEach(
      handler => handler(record)
    );

    return record;

  },


  subscribe(type, handler){

    if(!subscribers[type]){
      subscribers[type]=[];
    }

    subscribers[type].push(handler);

    return {
      subscribed:true,
      type
    };

  },


  list(){

    return events;

  }

};

export default AfriDebugEventBus;
