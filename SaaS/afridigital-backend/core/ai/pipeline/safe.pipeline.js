/**
 * 🔁 A3.18.12 SAFE PIPELINE GATE
 * Prevents loops + spam execution
 */

const recentEvents = new Map();

function allow(event) {

  const key = event.payload?.userId || event.id;

  const now = Date.now();
  const last = recentEvents.get(key) || 0;

  // 2 second cooldown per user
  if (now - last < 2000) {
    return false;
  }

  recentEvents.set(key, now);
  return true;
}

module.exports = { allow };
