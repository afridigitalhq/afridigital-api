const listeners = new Map();

function emit(event, payload) {
  if (!listeners.has(event)) return;

  for (const fn of listeners.get(event)) {
    try { fn(payload); } catch (e) {}
  }
}

function on(event, fn) {
  if (!listeners.has(event)) listeners.set(event, []);
  listeners.get(event).push(fn);
}

module.exports = { emit, on };
