// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class KernelReplayDebugger {
  constructor({ ledger }) {
    this.ledger = ledger;
  }

  // Rebuild system state from event history
  rebuildState(upToTimestamp) {
    const events = this.ledger
      ?.getAll?.()
      ?.filter(e => e.timestamp <= upToTimestamp) || [];

    const state = {
      events: [],
      lastKnownState: null
    };

    for (const event of events) {
      state.events.push(event);

      if (event.state) {
        state.lastKnownState = event.state;
      }
    }

    return state;
  }

  // Replay full event chain sequentially
  replay() {
    const events = this.ledger?.getAll?.() || [];

    const timeline = [];

    for (const event of events) {
      timeline.push({
        event,
        timestamp: event.timestamp || null
      });
    }

    return {
      totalEvents: timeline.length,
      timeline
    };
  }

  // Trace causality for a specific event type
  trace(eventType) {
    const events = this.ledger?.getAll?.() || [];

    return events.filter(e => e.type === eventType);
  }
}

module.exports = { KernelReplayDebugger };
