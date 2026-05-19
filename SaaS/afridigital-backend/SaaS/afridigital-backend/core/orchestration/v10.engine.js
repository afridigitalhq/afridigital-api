const hub = require("../../realtime/event.hub");
const registry = require("../events/v10.event.registry");

class V10Engine {

  constructor() {

    this.traceLog = [];
    this.rejected = [];
  }

  emit(type, payload={}) {

    const validation =
      registry.validate(type, payload);

    if (!validation.ok) {

      const rejected = {
        type,
        payload,
        validation,
        ts: Date.now()
      };

      this.rejected.push(rejected);

      return {
        ok: false,
        error: "event_validation_failed",
        validation
      };
    }

    const trace = {
      type,
      payload,
      ts: Date.now()
    };

    this.traceLog.push(trace);

    hub.emitEvent({
      type,
      payload
    });

    return {
      ok: true,
      emitted: type
    };
  }

  snapshot() {

    return {
      ok: true,
      traces: this.traceLog.length,
      rejected: this.rejected.length
    };
  }

  traceReplay(limit=10) {

    return this.traceLog.slice(-limit);
  }
}

module.exports = new V10Engine();
