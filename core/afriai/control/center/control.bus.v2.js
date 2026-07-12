const EventEmitter = require("events");

class ControlBusV2 extends EventEmitter {
  constructor() {
    super();

    // 🧠 SINGLE EVENT STREAM (source of truth)
    this.events = [];
  }

  emitEvent(domain, type, payload = {}) {
    const event = {
      domain,            // AI | KERNEL | WS | PLUGIN | ANOMALY
      type,
      payload,
      ts: Date.now()
    };

    // append-only log (NO separation = scalable)
    this.events.push(event);

    // realtime broadcast
    this.emit("event", event);

    return event;
  }

  // 🔍 filterable query engine
  query(filter = {}) {
    return this.events.filter(e => {
      if (filter.domain && e.domain !== filter.domain) return false;
      if (filter.type && e.type !== filter.type) return false;
      return true;
    });
  }

  // 📊 snapshot for dashboards
  snapshot() {
    return {
      system: "AfriDigital Control Center v2",
      totalEvents: this.events.length,
      breakdown: this.events.reduce((acc, e) => {
        acc[e.domain] = (acc[e.domain] || 0) + 1;
        return acc;
      }, {}),
      ts: Date.now()
    };
  }
}

module.exports = new ControlBusV2();
