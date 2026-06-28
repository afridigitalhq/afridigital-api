// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { normalizeEvent, validateEvent } = require("../contract/event.contract");
const { assertNoSprawl } = require("../guard/sprawl.guard");

/**
 * KERNEL BRIDGE (CONVERGENCE LAYER)
 * - Single ingestion point for all system events
 * - No execution logic allowed
 * - Only validation + routing + ledger append
 */
class KernelBridge {
  constructor({ ledger, hud, governance }) {
    this.ledger = ledger;
    this.hud = hud;
    this.governance = governance;
  }

  route(event) {
    assertNoSprawl();

    const normalized = normalizeEvent(event);

    if (!validateEvent(normalized)) {
      return { ok: false, error: "INVALID_EVENT" };
    }

    // Append-only ledger (source of truth)
    this.ledger?.append?.(normalized);

    // HUD is read-only stream
    this.hud?.broadcast?.({
      type: "KERNEL_EVENT",
      data: normalized
    });

    // Governance only evaluates, never executes
    this.governance?.evaluate?.(normalized);

    return { ok: true, status: "ROUTED" };
  }
}

module.exports = { KernelBridge };
