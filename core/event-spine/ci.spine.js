let listeners = [];

function emit(event) {
  const payload = {
    id: Date.now() + "-" + Math.random().toString(16).slice(2),
    ...event,
    ts: Date.now()
  };

  listeners.forEach(fn => fn(payload));
  return payload;
}

function subscribe(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

module.exports = { emit, subscribe };
// DEPRECATED (SAFE MODE): superseded by canonical kernel map
