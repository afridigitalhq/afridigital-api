const ledger = require("../../ledger/wallet.ledger");

class TimeTravelEngine {
  constructor() {
    this.trace = false;
  }

  enableTrace(flag = true) {
    this.trace = flag;
  }

  log(event) {
    if (this.trace) {
      console.log("⏱ TRACE:", event.type, event.payload);
    }
  }

  replay(events, reducer, initial = {}) {
    return events.reduce((state, event) => {
      this.log(event);
      return reducer(state, event);
    }, initial);
  }

  getStateAt(timestamp, reducer) {
    const events = ledger.getEventsUntil(timestamp);
    return this.replay(events, reducer || ledger.reducer, {});
  }

  replayRange(from, to, reducer) {
    const events = ledger.getEventsRange(from, to);
    return this.replay(events, reducer || ledger.reducer, {});
  }
}

module.exports = new TimeTravelEngine();
