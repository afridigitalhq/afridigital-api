/**
 * 🧠 AFRISCAN EVENT GOVERNOR
 * - prevents duplicate emissions
 * - enforces single event flow
 */

const seen = new Map();

function hash(event) {
  try {
    return event.type + ":" + JSON.stringify(event.payload || {});
  } catch {
    return event.type + ":raw";
  }
}

function shouldEmit(event) {
  const key = hash(event);
  const now = Date.now();

  if (seen.has(key)) {
    const last = seen.get(key);
    if (now - last < 250) return false; // dedupe window
  }

  seen.set(key, now);
  return true;
}

module.exports = {
  shouldEmit
};
