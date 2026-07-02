const { getUser, updateUser } = require("./memory.store");

function attachMemory(req, res, next) {
  const userId = req.body?.userId || "guest";

  req.memory = {
    userId,
    state: getUser(userId),

    addMessage(role, text) {
      updateUser(userId, (u) => {
        u.messages.push({ role, text, time: Date.now() });
        return u;
      });
    },

    addIntent(intent) {
      updateUser(userId, (u) => {
        u.intents.push({ intent, time: Date.now() });
        return u;
      });
    },

    addTrace(trace) {
      updateUser(userId, (u) => {
        u.traces.push({ ...trace, time: Date.now() });
        return u;
      });
    }
  };

  next();
}

module.exports = { attachMemory };
