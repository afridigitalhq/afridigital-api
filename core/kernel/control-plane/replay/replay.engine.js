// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class KernelReplayEngine {
  constructor({ ledger }) {
    this.ledger = ledger;
  }

  trace(eventId) {
    return this.ledger?.trace?.(eventId) || [];
  }

  rebuild(eventId) {
    return {
      eventId,
      reconstructed: true,
      state: this.ledger?.snapshot?.(eventId)
    };
  }
}

module.exports = { KernelReplayEngine };
