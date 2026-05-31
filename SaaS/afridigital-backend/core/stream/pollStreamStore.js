const streams = new Map();

function pushEvent(streamId, event) {
  if (!streams.has(streamId)) streams.set(streamId, []);
  streams.get(streamId).push(event);
}

function getStream(streamId) {
  return streams.get(streamId) || [];
}

function clearStream(streamId) {
  streams.delete(streamId);
}

module.exports = { pushEvent, getStream, clearStream };
