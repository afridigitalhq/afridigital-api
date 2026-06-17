const listeners = {
  dag: new Set(),
  region: new Set(),
  anomaly: new Set(),
  kernel: new Set()
};

export function subscribe(socket) {
  if (!socket) return;

  socket.on("dag:event", e => listeners.dag.forEach(fn => fn(e)));
  socket.on("region:metric", e => listeners.region.forEach(fn => fn(e)));
  socket.on("anomaly:detected", e => listeners.anomaly.forEach(fn => fn(e)));
  socket.on("kernel:update", e => listeners.kernel.forEach(fn => fn(e)));
}

export function on(type, fn) {
  if (listeners[type]) listeners[type].add(fn);
  return () => listeners[type].delete(fn);
}

export function clear() {
  Object.values(listeners).forEach(s => s.clear());
}
