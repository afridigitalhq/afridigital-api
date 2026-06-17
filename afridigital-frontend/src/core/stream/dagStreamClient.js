import { normalizeDagEvent } from "./dagStreamContract";

export function createDagStream(socket) {
  const listeners = new Set();

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function push(event) {
    const normalized = normalizeDagEvent(event);
    if (!normalized) return;

    listeners.forEach(fn => fn(normalized));
  }

  if (socket) {
    socket.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.type?.includes("dag")) {
          push(data);
        }
      } catch (e) {}
    };
  }

  return { subscribe };
}
