const { emit } = require("../spine/ci.spine");
const { transition } = require("../kernel/unified.kernel");
const { vote, getStatus } = require("../governance/quorum");
const { pushHud } = require("../hud/stream");

function processEvent(event) {
  // 1. Always emit into spine
  const e = emit(event);

  // 2. Governance check (if required)
  if (event.requiresQuorum) {
    const q = getStatus(event.id);

    if (!q || q.status !== "APPROVED") {
      return { blocked: true, reason: "QUORUM_PENDING", event: e };
    }
  }

  // 3. State transition (controlled)
  if (event.nextState) {
    transition(event.nextState, event.meta || {});
  }

  // 4. Push to HUD (visual only)
  pushHud(e);

  return { ok: true, event: e };
}

module.exports = { processEvent };
