
// CONSENSUS LOCK (per-account ordering control)
const locks = new Map();

function acquireLock(accountId) {
  if (locks.get(accountId)) return false;
  locks.set(accountId, true);
  return true;
}

function releaseLock(accountId) {
  locks.delete(accountId);
}

module.exports = { acquireLock, releaseLock };

