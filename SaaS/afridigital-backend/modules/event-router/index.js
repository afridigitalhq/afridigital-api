const listeners = {};

function on(event, fn) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(fn);
}

function emit(event, data) {
  (listeners[event] || []).forEach(fn => fn(data));
  (listeners['*'] || []).forEach(fn => fn({ event, data }));
}

module.exports = { on, emit };
module.exports = module.exports || {};
