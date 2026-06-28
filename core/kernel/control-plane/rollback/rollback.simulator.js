// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class RollbackSimulator {
  constructor({ ledger }) {
    this.ledger = ledger;
  }

  preview(timestamp) {
    return {
      timestamp,
      state: this.ledger?.snapshotAt?.(timestamp),
      mode: "SIMULATION_ONLY"
    };
  }
}

module.exports = { RollbackSimulator };
