const sessions = new Map();

export function ConversationMemory(sessionId = "landing") {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }

  const history = sessions.get(sessionId);

  return {
    add(message) {
      history.push(message);

      if (history.length > 20) {
        history.shift();
      }
    },

    get() {
      return [...history];
    },

    clear() {
      history.length = 0;
    },

    size() {
      return history.length;
    }
  };
}

export default ConversationMemory;
