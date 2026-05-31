const store = require('../pollStreamStore');

function emit(streamId, event) {
  if (!streamId) return;
  store.pushEvent(streamId, event);
}

function get(streamId) {
  return store.getStream(streamId);
}

function clear(streamId) {
  return store.clearStream(streamId);
}

module.exports = { emit, get, clear };
