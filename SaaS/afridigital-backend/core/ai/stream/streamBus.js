const streams = new Map();

function push(streamId, event) {
  if (!streams.has(streamId)) streams.set(streamId, []);
  streams.get(streamId).push(event);
}

function get(streamId) {
  return streams.get(streamId) || [];
}

function clear(streamId) {
  streams.delete(streamId);
}

module.exports = { push, get, clear };
