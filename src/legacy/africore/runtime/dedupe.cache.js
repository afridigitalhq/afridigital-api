const seen = new Map();

function isDuplicate(id) {
  if (!id) return false;

  const now = Date.now();
  const last = seen.get(id);

  if (last && now - last < 15000) return true;

  seen.set(id, now);
  return false;
}

module.exports = { isDuplicate };
