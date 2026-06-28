// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class ReplayEngine {
  constructor(ledger) {
    this.ledger = ledger;
  }

  replay() {
    const events = this.ledger.readAll();

    return events.map(e => ({
      ts: e.ts,
      event: e.event
    }));
  }
}

module.exports = { ReplayEngine };
