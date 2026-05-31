const sessions = require("../bridge/session");

/**
 * STREAM HUB
 * bridges LLM → WhatsApp relay layer
 */
function streamToken(userId, token) {
  return sessions.appendToken(userId, token);
}

function flushStream(userId) {
  const session = sessions.getSession(userId);
  if (!session) return "";

  const text = session.buffer;
  sessions.clearSession(userId);

  return text;
}

module.exports = {
  streamToken,
  flushStream
};
