const streams = new Map();
const subscribers = new Map();

function emit(streamId, event) {
  if (!streams.has(streamId)) {
    streams.set(streamId, []);
  }

  const arr = streams.get(streamId);
  arr.push(event); // 🔥 ALWAYS persist first

  const subs = subscribers.get(streamId);
  if (subs) {
    for (const fn of subs) fn(event);
  }
}

function get(streamId) {
  return streams.get(streamId) || [];
}

function subscribe(streamId, fn) {
  if (!subscribers.has(streamId)) {
    subscribers.set(streamId, []);
  }
  subscribers.get(streamId).push(fn);
}

function clear(streamId) {
  streams.delete(streamId);
  subscribers.delete(streamId);
}

module.exports = { emit, get, subscribe, clear };
