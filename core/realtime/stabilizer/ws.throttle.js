let last = null;
let pending = null;

function shouldDrop(next) {
  if (!last) return false;

  // drop identical payloads
  return JSON.stringify(last) === JSON.stringify(next);
}

function throttleBroadcast(broadcast, payload) {
  if (shouldDrop(payload)) return;

  pending = payload;

  if (!global.__ws_tick) {
    global.__ws_tick = setInterval(() => {
      if (pending) {
        broadcast(pending);
        last = pending;
        pending = null;
      }
    }, 20);
  }
}

module.exports = { throttleBroadcast };
