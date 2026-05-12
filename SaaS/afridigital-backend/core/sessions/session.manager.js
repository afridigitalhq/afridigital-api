const { assertApiVersion } = require("../runtime/safety/api.guard");
const sessions = new Map();

function unlockSession(user) {
  sessions.set(user, {
    unlocked: true,
    timestamp: Date.now()
  });
}

function lockSession(user) {
  sessions.delete(user);
}

function isUnlocked(user) {
  const session = sessions.get(user);

  if (!session) return false;

  const expired =
    Date.now() - session.timestamp > 15 * 60 * 1000;

  if (expired) {
    sessions.delete(user);
    return false;
  }

  return true;
}

module.exports = {
  unlockSession,
  lockSession,
  isUnlocked
};
