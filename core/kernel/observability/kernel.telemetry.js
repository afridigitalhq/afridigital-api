// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
/**
 * READ-ONLY KERNEL TELEMETRY STREAM
 */

let listeners = [];

function subscribe(fn) {
  listeners.push(fn);
}

function emitTelemetry(event) {
  const packet = {
    ts: Date.now(),
    event
  };

  listeners.forEach(fn => {
    try { fn(packet); } catch (e) {}
  });

  return packet;
}

module.exports = {
  subscribe,
  emitTelemetry
};
