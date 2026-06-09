const listeners = [];

function emit(event) {
  const normalized = {
    id: Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    type: event.type,
    payload: event.payload || {},
    ts: Date.now()
  };

  listeners.forEach(fn => fn(normalized));
}

function subscribe(fn) {
  listeners.push(fn);
}

module.exports = { emit, subscribe };
