class ConsciousEventBus {
  constructor() {
    this.subscribers = new Map();
  }

  emit(event) {
    const list = this.subscribers.get(event.type) || [];
    list.forEach(fn => fn(event));
  }

  on(type, fn) {
    const list = this.subscribers.get(type) || [];
    list.push(fn);
    this.subscribers.set(type, list);
  }
}

export const consciousnessBus = new ConsciousEventBus();
