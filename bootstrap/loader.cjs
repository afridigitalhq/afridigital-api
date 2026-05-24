const path = require('path');
const Module = require('module');

const ROOT = path.resolve(__dirname, '..');

/**
 * AFRI CLEAN LOCK v1
 * - Prevents event-bus fragmentation
 * - Forces kernel as single source of truth
 */

const alias = {
  'AFRI_EVENTS': path.join(ROOT, 'afridigital-core/kernel/events'),
  'AFRI_KERNEL_EVENTS': path.join(ROOT, 'afridigital-core/kernel/events/event.bus.cjs'),
};

const originalRequire = Module.prototype.require;

Module.prototype.require = function (req) {

  if (alias[req]) {
    return originalRequire.call(this, alias[req]);
  }

  // HARD LOCK: anything event-bus → kernel/events
  if (typeof req === 'string' && req.includes('event-bus')) {
    return originalRequire.call(
      this,
      path.join(ROOT, 'afridigital-core/kernel/events/event.bus.cjs')
    );
  }

  return originalRequire.call(this, req);
};

console.log("🧱 AFRI CLEAN LOCK v1 ACTIVE");
