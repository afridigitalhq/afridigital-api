const memory = new Map();

/**
 * Simple in-memory store (upgrade later to Redis)
 */

module.exports = {
  get(userId){
    return memory.get(userId) || {
      history: [],
      summary: "",
      lastIntent: null
    };
  },

  append(userId, entry){
    const data = this.get(userId);

    data.history.push({
      text: entry.text,
      role: entry.role || "user",
      ts: Date.now()
    });

    // keep last 20 messages only (lightweight memory)
    data.history = data.history.slice(-20);

    memory.set(userId, data);
    return data;
  },

  setIntent(userId, intent){
    const data = this.get(userId);
    data.lastIntent = intent;
    memory.set(userId, data);
  }
};
