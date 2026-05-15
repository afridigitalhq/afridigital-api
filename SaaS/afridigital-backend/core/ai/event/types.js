/**
 * 📦 A3 EVENT CORE (FIXED)
 * Minimal event factory for entire AI system
 */

function createEvent(type, payload = {}) {
  return {
    id: Date.now().toString() + "_" + Math.random().toString(36).slice(2, 8),
    type,
    payload,
    ts: Date.now()
  };
}

module.exports = { createEvent };
