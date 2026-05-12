
// STATE BUILDER (reconstructs system state)
const { getOrderedEvents } = require('./replay.engine');

function rebuildState(handlers) {
  const events = getOrderedEvents();
  const state = {};

  events.forEach(record => {
    const handler = handlers[record.topic];
    if (handler) {
      handler(state, record.event);
    }
  });

  return state;
}

module.exports = { rebuildState };

