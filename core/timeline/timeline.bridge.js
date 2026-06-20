const bus = require('../../africore/runtime/event.bus');
const engine = require('./time.engine');

/**
 * Passive mirror only (NO mutation)
 */
function attachTimeline() {

  bus.on('AI_REQUEST', (e) => engine.recordEvent(e));
  bus.on('TRACE', (e) => engine.recordEvent(e));
  bus.on('SYSTEM_ERROR', (e) => engine.recordEvent(e));
  bus.on('ROUTE_LEARN', (e) => engine.recordEvent(e));

  console.log('🧠 TIME TRAVEL LAYER ACTIVE (READ-ONLY)');
}

module.exports = { attachTimeline };
