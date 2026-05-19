const sessions = new Map();

module.exports = {
  get(userId) {
    return sessions.get(userId) || {};
  },

  set(userId, data) {
    sessions.set(userId, {
      ...sessions.get(userId),
      ...data,
      updatedAt: Date.now()
    });
  }
};
