let last = null;
let buffer = null;
let timer = null;

function shallowDiff(a, b) {
  if (!a || !b) return true;
  return JSON.stringify(a) !== JSON.stringify(b);
}

function attachDiffBroadcast(broadcast, interval = 40) {
  return function send(payload) {
    buffer = payload;

    if (timer) return;

    timer = setTimeout(() => {
      timer = null;

      if (!last || shallowDiff(last, buffer)) {
        last = buffer;
        broadcast(buffer);
      }
    }, interval);
  };
}

module.exports = { attachDiffBroadcast };
