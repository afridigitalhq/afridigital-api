export class IncidentReplayEngine {
  constructor(eventBus, caseEngine, responseEngine) {
    this.eventBus = eventBus;
    this.caseEngine = caseEngine;
    this.responseEngine = responseEngine;

    this.timeline = [];

    this.init();
  }

  init() {
    this.eventBus?.on?.("CASE_CREATED", (data) => {
      this.record("CASE_CREATED", data);
    });

    this.eventBus?.on?.("CLIP_GENERATED", (data) => {
      this.record("CLIP_GENERATED", data);
    });

    this.eventBus?.on?.("AUTO_RESPONSE_EXECUTED", (data) => {
      this.record("AUTO_RESPONSE_EXECUTED", data);
    });
  }

  record(type, payload) {
    this.timeline.push({
      type,
      payload,
      timestamp: Date.now()
    });
  }

  getTimeline(filter = {}) {
    let result = [...this.timeline];

    if (filter.type) {
      result = result.filter(e => e.type === filter.type);
    }

    if (filter.since) {
      result = result.filter(e => e.timestamp >= filter.since);
    }

    return result;
  }

  replay(caseId) {
    return this.timeline.filter(e =>
      JSON.stringify(e.payload).includes(caseId)
    );
  }

  clear() {
    this.timeline = [];
  }
}

export const incidentReplayEngine = new IncidentReplayEngine();
