// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class TimelineBuilder {
  constructor(ledger) {
    this.ledger = ledger;
  }

  build() {
    const events = this.ledger.readAll();

    return events.map(e => ({
      time: e.ts,
      type: e.event?.type || "unknown",
      hash: e.hash
    }));
  }
}

module.exports = { TimelineBuilder };
