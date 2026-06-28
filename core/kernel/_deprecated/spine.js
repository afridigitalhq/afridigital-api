// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
let listeners = [];

function emit(event) {
  const payload = {
    ...event,
    ts: Date.now()
  };

  listeners.forEach(fn => {
    try { fn(payload); } catch (e) {}
  });

  return payload;
}

function subscribe(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(f => f !== fn);
  };
}

module.exports = { emit, subscribe };
// DEPRECATED (SAFE MODE): superseded by canonical kernel map
