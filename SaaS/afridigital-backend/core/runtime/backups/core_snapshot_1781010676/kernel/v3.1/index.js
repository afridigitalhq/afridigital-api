const store = require('./eventStore');
const memory = require('./memoryStore');
const replay = require('./replay');

let initialized = false;

function init(bus) {

  if (initialized) return;
  initialized = true;

  console.log("🧠 V3.1 INIT START");

  // 1. restore memory (no side effects)
  const state = memory.load();

  // 2. replay events SAFELY (no re-hooking inside replay)
  const count = replay.replay((event) => {
    if (bus && bus.emitEvent) {
      bus.emitEvent.__raw?.(event.type, event.payload || {});
    }
  });

  console.log("🧠 V3.1 REPLAY DONE:", count);

  // 3. install persistence layer ONLY (no emitting)
  if (bus && bus.emitEvent) {

    const original = bus.emitEvent.bind(bus);

    bus.emitEvent = function(type, payload) {
      store.append({ type, payload });
      return original(type, payload);
    };

    // expose raw for replay safety
    bus.emitEvent.__raw = original;
  }

  console.log("🧠 V3.1 PERSISTENCE ATTACHED");
}

module.exports = { init };
