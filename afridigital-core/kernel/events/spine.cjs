const listeners = {};

function emit(event, data) {
  console.log("📡 EVENT:", event);
  (listeners[event] || []).forEach(fn => fn(data));
}

function on(event, fn) {
  listeners[event] = listeners[event] || [];
  listeners[event].push(fn);
}

module.exports = { emit, on };
