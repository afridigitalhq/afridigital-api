/**
 * AfriAI Memory System v1
 * In-memory session store (non-persistent for safety)
 */

const sessions = new Map();

function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      id: userId,
      history: [],
      createdAt: Date.now()
    });
  }
  return sessions.get(userId);
}

function appendToSession(userId, message) {
  const session = getSession(userId);
  session.history.push({
    message,
    ts: Date.now()
  });
  return session;
}

module.exports = { getSession, appendToSession };
