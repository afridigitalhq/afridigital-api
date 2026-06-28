export class SOCEventBus {
  constructor() {
    this.listeners = new Map();
  }

  emit(event) {
    const list = this.listeners.get(event.type) || [];
    list.forEach(fn => fn(event));
  }

  on(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(fn);
  }
}
