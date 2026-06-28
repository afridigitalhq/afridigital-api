// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class KernelAPI {
  constructor({ syscallGate, ledger, telemetry, replay }) {
    this.syscallGate = syscallGate;
    this.ledger = ledger;
    this.telemetry = telemetry;
    this.replay = replay;
  }

  querySystem() {
    return {
      status: "ONLINE",
      health: this.telemetry?.snapshot?.() || {},
      events: this.ledger?.readAll?.()?.length || 0
    };
  }

  requestExecution(event) {
    // IMPORTANT: KEIL does NOT execute directly
    return this.syscallGate.dispatch(event);
  }

  getReplay(eventId) {
    return this.replay?.fullTrace?.(eventId);
  }
}

module.exports = { KernelAPI };
