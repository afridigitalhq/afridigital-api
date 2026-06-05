const bus = require('../bus/eventBus');
const memory = require('../memory/store');

function init() {

  bus.onEvent('message', (payload) => {
    const { sessionId, data } = payload;

    memory.set(sessionId, data);

    bus.emitEvent('processed', {
      sessionId,
      status: 'stored'
    });
  });

  bus.onEvent('plugin:load', (p) => {
    bus.emitEvent('log', {
      message: `Plugin loaded: ${p.name}`
    });
  });

  console.log('🧠 V3 ORCHESTRATOR ACTIVE');
}

module.exports = { init };
