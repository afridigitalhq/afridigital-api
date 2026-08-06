const listeners = new Map();
const history = [];

const AfriDebugEventBus = {
  on(event, handler){
    if(!listeners.has(event)) listeners.set(event, []);
    listeners.get(event).push(handler);
  },

  emit(event, payload = {}){
    const record = {
      id:`EVENT-${Date.now()}`,
      event,
      payload,
      timestamp:Date.now()
    };

    history.push(record);

    (listeners.get(event) || []).forEach(fn => fn(record));

    return record;
  },

  history(){
    return history;
  },

  events(){
    return [...listeners.keys()];
  }
};

export default AfriDebugEventBus;
