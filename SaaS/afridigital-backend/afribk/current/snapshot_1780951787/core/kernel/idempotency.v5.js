
const seen = new Set();

function isDuplicate(messageId) {
  if (seen.has(messageId)) return true;
  seen.add(messageId);
  return false;
}

module.exports = { isDuplicate };

