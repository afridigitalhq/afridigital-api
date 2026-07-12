/**
 * MODULE LIFECYCLE RULES (ZERO DRIFT)
 * Modules are permanent runtime services
 */

function assertPermanentModule(module) {
  if (!module || typeof module !== 'object') {
    throw new Error('INVALID MODULE');
  }

  if (!module.id) {
    throw new Error('MODULE MUST HAVE ID');
  }

  if (typeof module.__validate !== 'function') {
    throw new Error('MODULE MUST IMPLEMENT __validate()');
  }

  if (!module.__validate()) {
    throw new Error('MODULE FAILED VALIDATION');
  }

  return true;
}

function forbidUnload() {
  throw new Error('MODULE LIFECYCLE LOCKED: unload not allowed');
}

module.exports = {
  assertPermanentModule,
  forbidUnload
};
