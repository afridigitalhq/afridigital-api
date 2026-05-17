/**
 * 🛡 AFRIDIGITAL EVENT GUARD (C4 CORE FIX)
 * Prevents duplicate processing + loopback execution
 */

const processed = new Set();

function markEvent(event) {
  if (!event) return false;

  if (!event.id) {
    event.id = `${event.type || "UNKNOWN"}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  if (processed.has(event.id)) return false;

  processed.add(event.id);

  // prevent memory explosion (soft cap)
  if (processed.size > 5000) {
    const first = processed.values().next().value;
    processed.delete(first);
  }

  return true;
}

function shouldProcess(event) {
  return markEvent(event);
}

module.exports = { shouldProcess, markEvent };
