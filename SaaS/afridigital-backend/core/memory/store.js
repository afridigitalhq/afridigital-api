const memory = new Map();

/**
 * structure:
 * userId => {
 *   messages: [],
 *   lastIntent: string
 * }
 */

function getUser(userId) {
  if (!memory.has(userId)) {
    memory.set(userId, {
      messages: [],
      lastIntent: null
    });
  }

  return memory.get(userId);
}

function pushMessage(userId, message) {
  const user = getUser(userId);

  user.messages.push({
    text: message.text,
    timestamp: Date.now()
  });

  // keep memory small (last 10 messages)
  if (user.messages.length > 10) {
    user.messages.shift();
  }

  return user;
}

function setIntent(userId, intent) {
  const user = getUser(userId);
  user.lastIntent = intent;
}

function getContext(userId) {
  return getUser(userId);
}

module.exports = {
  getUser,
  pushMessage,
  setIntent,
  getContext
};
