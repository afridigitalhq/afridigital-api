const sessions = new Map();

/**
 * sessionId = user phone / whatsapp id
 */
function createSession(id) {
  if (!sessions.has(id)) {
    sessions.set(id, {
      buffer: "",
      active: true
    });
  }
  return sessions.get(id);
}

function appendToken(id, token) {
  const s = createSession(id);
  s.buffer += token;
  return s.buffer;
}

function getSession(id) {
  return sessions.get(id);
}

function clearSession(id) {
  sessions.delete(id);
}

module.exports = {
  createSession,
  appendToken,
  getSession,
  clearSession
};
