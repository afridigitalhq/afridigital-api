export class EventImplementation {
  constructor() {
    this.name = "EventImplementation";
    this.events = [];
  }

  emit(event, payload) {
    this.events.push({ event, payload, timestamp: Date.now() });
    return { ok: true };
  }

  list() {
    return this.events;
  }
}
