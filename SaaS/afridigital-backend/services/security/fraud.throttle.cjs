const limits = new Map();

function allow(userId) {
  const now = Date.now();

  if (!limits.has(userId)) {
    limits.set(userId, []);
  }

  const recent = limits
    .get(userId)
    .filter(t => now - t < 60000);

  recent.push(now);

  limits.set(userId, recent);

  if (recent.length > 25) {
    return false;
  }

  return true;
}

module.exports = { allow };
