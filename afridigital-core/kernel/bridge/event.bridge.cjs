/**
 * 🌉 AFRI EVENT BRIDGE v1 (CLEAN REBUILD)
 * - stable event bus
 * - safe for tap + filter + fraud engine
 */

class EventBridge {
  constructor() {
    this.handlers = {};
  }

  emit(event, payload = {}) {
    const packet = {
      event,
      payload,
      ts: Date.now(),
      source: "AFRI_BRIDGE_V1"
    };

    if (this.handlers[event]) {
      for (const fn of this.handlers[event]) {
        try { fn(packet); } catch (e) {}
      }
    }

    return packet;
  }

  on(event, fn) {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(fn);
  }
}

module.exports = new EventBridge();
