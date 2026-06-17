const limits = new Map();

function check(apiKey, limit = 20) {
  const now = Date.now();
  const entry = limits.get(apiKey) || { count: 0, ts: now };

  if (now - entry.ts > 60000) {
    entry.count = 0;
    entry.ts = now;
  }

  entry.count++;
  limits.set(apiKey, entry);

  return entry.count <= limit;
}

module.exports = { check };
