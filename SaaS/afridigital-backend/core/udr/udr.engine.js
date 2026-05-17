const bus = require('./udr.bus');
const { modules } = require('./module.registry');
const { canAccess } = require('./udr.permissions');

console.log('🚀 UDR ENGINE v1 ACTIVE');

function routeEvent(event) {
  const { type, payload } = event;

  // Core routing logic
  if (type === 'whatsapp.message') {
    bus.emitEvent('module.whatsappOS', payload);
  }

  if (type === 'finance.txn') {
    bus.emitEvent('module.finance', payload);
  }

  if (type === 'system.health') {
    bus.emitEvent('module.kernel', payload);
  }

  if (type === 'ai.reply') {
    bus.emitEvent('module.aiCore', payload);
  }

  return true;
}

function emit(moduleId, eventType, payload, role = 'system') {
  if (!canAccess(role, moduleId)) {
    console.log('⛔ ACCESS DENIED:', moduleId, role);
    return;
  }

  return bus.emitEvent(`module.${moduleId}.${eventType}`, payload);
}

module.exports = {
  routeEvent,
  emit,
  bus
};
