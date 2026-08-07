import { AfriFixRuntimeEventStore } from "../eventstore/AfriFixRuntimeEventStore.js";

export class AfriFixRuntimeReplayEngine {
  constructor() {
    this.store = new AfriFixRuntimeEventStore();
  }

  replay(executionId) {
    const events = this.store.byExecution(executionId);

    return {
      component: "AfriFix Runtime Replay Engine",
      status: events.length ? "REPLAY_READY" : "NOT_FOUND",
      executionId,
      totalEvents: events.length,
      timeline: events.map(e => ({
        sequence: e.sequence,
        event: e.type,
        timestamp: e.timestamp
      })),
      replayedAt: new Date().toISOString()
    };
  }
}
