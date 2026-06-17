export function createDagStream(socket) {
  const listeners = new Set();

  function onEvent(handler) {
    listeners.add(handler);
  }

  function emit(data) {
    listeners.forEach(fn => fn(data));
  }

  if (socket) {
    socket.on("dag:event", (payload) => emit(payload));
    socket.on("kernel:update", (payload) => emit(payload));
  }

  return { onEvent };
}
