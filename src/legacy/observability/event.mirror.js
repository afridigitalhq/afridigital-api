const EventEmitter = require('events');

/**
 * READ-ONLY EVENT MIRROR
 * - duplicates events safely
 * - never modifies original bus
 */
class EventMirror extends EventEmitter {
  constructor() {
    super();
    this.store = [];
  }

  ingest(event) {
    const snapshot = {
      ts: Date.now(),
      type: event.type,
      stage: event.stage || null,
      traceId: event.traceId || "unknown",
      payload: event.payload || {}
    };

    this.store.push(snapshot);
    this.emit("mirror.event", snapshot);
  }

  query(traceId) {
    return this.store.filter(e => e.traceId === traceId);
  }

  all() {
    return this.store;
  }
}

module.exports = new EventMirror();
