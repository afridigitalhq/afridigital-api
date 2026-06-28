const sessions = new Map();

/**
 * READ-ONLY AfriAI Bridge
 * No kernel mutation allowed
 */

function getSession(id) {
  if (!sessions.has(id)) {
    sessions.set(id, { messages: [], lastActive: Date.now() });
  }
  return sessions.get(id);
}

function pushMessage(sessionId, message) {
  const session = getSession(sessionId);
  session.messages.push(message);
  session.lastActive = Date.now();
  return session;
}

function handleAsk({ sessionId = "anon", message = "" }) {
  const session = pushMessage(sessionId, { role: "user", message });

  // deterministic safe response layer (no AI mutation logic)
  const reply = {
    sessionId,
    reply: `AfriAI received: ${message}`,
    contextSize: session.messages.length
  };

  session.messages.push({ role: "afriai", message: reply.reply });

  return reply;
}

module.exports = {
  getSession,
  pushMessage,
  handleAsk
};
