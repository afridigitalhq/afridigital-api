const seen = new Map();

async function isDuplicate(messageId) {
  if (!messageId) return false;

  if (seen.has(messageId)) return true;

  seen.set(messageId, Date.now());

  // auto cleanup after 1 hour
  setTimeout(() => seen.delete(messageId), 60 * 60 * 1000);

  return false;
}

module.exports = { isDuplicate };
