const memory = new Map();

function getUser(id) {
  if (!memory.has(id)) {
    memory.set(id, {
      messages: [],
      createdAt: Date.now()
    });
  }
  return memory.get(id);
}

function pushMessage(userId, payload) {
  try {
    const user = getUser(userId);

    user.messages.push({
      text: payload.text,
      ts: Date.now()
    });

    // keep last 10 only
    if (user.messages.length > 10) {
      user.messages = user.messages.slice(-10);
    }

    memory.set(userId, user);

    return user;
  } catch (err) {
    console.log("🟡 memory error:", err.message);
    return null;
  }
}

function getContext(userId) {
  return getUser(userId);
}

module.exports = {
  pushMessage,
  getContext
};
