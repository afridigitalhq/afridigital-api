// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class GlobalReplayEngine {
  constructor({ ledger, telemetry, kcp, kspl, syscall, kfcl }) {
    this.ledger = ledger;
    this.telemetry = telemetry;
    this.kcp = kcp;
    this.kspl = kspl;
    this.syscall = syscall;
    this.kfcl = kfcl;
  }

  replayAt(timestamp) {
    const logs = this.ledger.readAll();

    const slice = logs.filter(
      e => Math.abs(e.ts - timestamp) < 5000
    );

    return {
      timestamp,
      events: slice,
      explanation: "SYSTEM STATE RECONSTRUCTED (FOR FORENSICS ONLY)"
    };
  }

  fullTrace(eventId) {
    const logs = this.ledger.readAll();

    return logs.filter(e =>
      JSON.stringify(e.event || {}).includes(eventId)
    );
  }
}

module.exports = { GlobalReplayEngine };
