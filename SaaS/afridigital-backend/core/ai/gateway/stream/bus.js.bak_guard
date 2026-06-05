const streams = new Map();

function push(id, event) {
  if (!streams.has(id)) streams.set(id, []);
  streams.get(id).push(event);
}

function get(id) {
  return streams.get(id) || [];
}

function clear(id) {
  streams.delete(id);
}

module.exports = { push, get, clear };
