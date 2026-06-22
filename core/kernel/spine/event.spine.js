/**
 * KERNEL EVENT SPINE CONTRACT (KESC v1)
 * -------------------------------------
 * Single source of truth for ALL system events:
 * Snapshot, CI, WhatsApp, GitHub, HUD
 */

function createEvent({ source, type, payload }) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ts: Date.now(),

    // WHERE it came from
    source: source, // "snapshot" | "ci" | "whatsapp" | "github" | "hud"

    // WHAT happened
    type: type,     // "REQUEST" | "APPROVED" | "REJECTED" | "SYNC" | "SNAPSHOT"

    // DATA (never executed directly)
    payload: payload || {},

    // IMMUTABILITY FLAG
    immutable: true
  };
}

/**
 * NORMALIZATION LAYER
 * Everything enters kernel in this format
 */
function normalizeEvent(event) {
  return createEvent(event);
}

/**
 * VALIDATION LAYER (NO EXECUTION RIGHTS)
 */
function validateEvent(event) {
  if (!event || !event.source || !event.type) {
    throw new Error("INVALID_EVENT");
  }

  return true;
}

module.exports = {
  createEvent,
  normalizeEvent,
  validateEvent
};
