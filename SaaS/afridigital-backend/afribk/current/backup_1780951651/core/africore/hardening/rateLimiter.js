const users = new Map();
const GLOBAL = {
  count: 0,
  windowStart: Date.now()
};

const LIMITS = {
  user: 20,      // messages per window
  global: 200,   // system-wide window cap
  windowMs: 60 * 1000
};

function resetIfNeeded() {
  const now = Date.now();
  if (now - GLOBAL.windowStart > LIMITS.windowMs) {
    GLOBAL.count = 0;
    GLOBAL.windowStart = now;
    users.clear();
  }
}

module.exports = {
  allow(userId) {
    resetIfNeeded();

    const user = users.get(userId) || { count: 0 };
    user.count += 1;
    users.set(userId, user);

    GLOBAL.count += 1;

    if (user.count > LIMITS.user) return { ok: false, reason: "user_rate_limit" };
    if (GLOBAL.count > LIMITS.global) return { ok: false, reason: "global_rate_limit" };

    return { ok: true };
  }
};
