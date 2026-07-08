export class AfriEventBus {
  constructor(){
    this.listeners = new Map();
  }

  on(event, handler){
    if(!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(handler);
  }

  emit(event, payload){
    const handlers = this.listeners.get(event) || [];

    console.log("⚡ EVENT:", event);

    for(const fn of handlers){
      try {
        fn(payload);
      } catch (e){
        console.log("❌ Event handler error:", e.message);
      }
    }
  }

  off(event, handler){
    const list = this.listeners.get(event) || [];
    this.listeners.set(event, list.filter(h => h !== handler));
  }
}
