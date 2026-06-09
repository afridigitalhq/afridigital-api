const memory = new Map();

function set(sessionId, data) {
  memory.set(sessionId, {
    data,
    ts: Date.now()
  });
}

function get(sessionId) {
  return memory.get(sessionId) || null;
}

function clear(sessionId) {
  memory.delete(sessionId);
}

module.exports = { set, get, clear };
