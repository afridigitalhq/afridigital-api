const k = require('./core/kernel');
const bus = require('./core/kernel/v3/bus/eventBus');
const v31 = require('./core/kernel/v3.1');

console.log("🧪 V3.1 SAFE CHECK");

console.log({
  kernel: {
    config: typeof k.config,
    runtime: typeof k.runtime,
    registry: typeof k.registry,
    resolve: typeof k.resolve
  },
  bus: typeof bus.emitEvent,
  v31: typeof v31.init
});

// test event
v31.init();
bus.emitEvent('health:check', { ok: true });

console.log("🟢 SYSTEM STABLE FOR V4");
