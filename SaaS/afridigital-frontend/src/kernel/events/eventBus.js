const listeners = {};

export const eventBus = {
  emit(event, payload) {
    (listeners[event] || []).forEach(fn => fn(payload));
  },

  on(event, fn) {
    listeners[event] = listeners[event] || [];
    listeners[event].push(fn);
  },

  off(event, fn) {
    listeners[event] = (listeners[event] || []).filter(f => f !== fn);
  }
};
