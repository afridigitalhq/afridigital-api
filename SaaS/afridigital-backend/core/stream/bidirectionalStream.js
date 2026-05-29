const { sendMessage, updateMessage } = require("../gateway/whatsappClient");

/**
 * STREAM STATE
 */
const sessions = new Map();

/**
 * Start streaming session
 */
async function startStream(userId, initialText) {
  const msg = await sendMessage(userId, initialText);

  const session = {
    messageId: msg?.messageId || null,
    buffer: initialText || ""
  };

  sessions.set(userId, session);

  return session;
}

/**
 * Push token update to WhatsApp (LIVE EDIT)
 */
async function pushToken(userId, token) {
  const session = sessions.get(userId);
  if (!session) return;

  session.buffer += token;

  if (!session.messageId) return;

  await updateMessage(session.messageId, session.buffer);
}

/**
 * finalize stream
 */
async function finalizeStream(userId) {
  const session = sessions.get(userId);
  if (!session) return;

  sessions.delete(userId);
}

module.exports = {
  startStream,
  pushToken,
  finalizeStream
};
