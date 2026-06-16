const listeners = {};

/**
 * Emit event across distributed nodes
 */
function emit(event, payload) {
  console.log(`[EVENT] ${event}`, payload);

  if (listeners[event]) {
    for (const fn of listeners[event]) {
      fn(payload);
    }
  }
}

/**
 * Subscribe to distributed events
 */
function on(event, handler) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(handler);
}

module.exports = { emit, on };
