const killSwitch = require('../security/kill.switch.cjs');
/**
 * 🧠 AFRI EVENT CORE STABLE (FINAL CONTRACT)
 */

const bus = require("../events/event.bus.cjs");
const tap = require("../tap/event.tap.cjs");
const filter = require("../filter/event.filter.cjs");

class EventCore {

  emit(event, payload = {}) {

    const packet = {
      event,
      payload,
      meta: {
        ts: Date.now()
      }
    };

    undefined

    try {
      if (tap?.tap) tap.tap(packet);
    } catch (e) {
      console.log("⚠️ TAP ERROR:", e.message);
    }

    return packet;
  }

  on(event, fn) {
    return bus.on(event, fn);
  }

  filter(type, events = []) {
    try {
      if (!filter?.filter) return events;
      return filter.filter(events, type);
    } catch {
      return events;
    }
  }
}

module.exports = new EventCore();
