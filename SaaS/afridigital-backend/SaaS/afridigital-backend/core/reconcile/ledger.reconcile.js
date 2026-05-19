const projector = require("../ledger/projection/balance.projector");
const stream = require("../stream/event.stream.log");

class Reconciler {
  run() {
    const events = stream.readFrom(0);
    const computed = projector.rebuild(events);

    return {
      status: "RECONCILED",
      balances: computed,
      eventCount: events.length
    };
  }

  check(userId) {
    const state = this.run().balances;
    return state[userId] || 0;
  }
}

module.exports = new Reconciler();
