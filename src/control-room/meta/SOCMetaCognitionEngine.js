export class SOCMetaCognitionEngine {
  constructor(eventBus, coordinationLayer) {
    this.eventBus = eventBus;
    this.coordination = coordinationLayer;

    this.history = [];
  }

  evaluateCycle({ event, decision, reasoning, outcome }) {
    const score = this._score(decision, reasoning, outcome);

    const record = {
      event,
      score,
      timestamp: Date.now(),
      breakdown: {
        reasoningConfidence: reasoning?.confidence || 0,
        decisionClarity: decision?.confidence || 0,
        outcomeStability: outcome?.stability || 0
      }
    };

    this.history.push(record);

    this.eventBus.emit("META_EVALUATION", record);

    return record;
  }

  _score(decision, reasoning, outcome) {
    const r = reasoning?.confidence || 0;
    const d = decision?.confidence || 0;
    const o = outcome?.stability || 0;

    return (r * 0.4) + (d * 0.4) + (o * 0.2);
  }

  getTrends() {
    if (this.history.length < 5) return null;

    const recent = this.history.slice(-20);

    const avg = recent.reduce((sum, r) => sum + r.score, 0) / recent.length;

    return {
      averageScore: avg,
      trend: this._trend(recent)
    };
  }

  _trend(data) {
    if (data.length < 2) return "STABLE";

    const first = data[0].score;
    const last = data[data.length - 1].score;

    if (last > first) return "IMPROVING";
    if (last < first) return "DEGRADING";
    return "STABLE";
  }
}

export const createMetaCognitionEngine = (bus, coordination) => {
  return new SOCMetaCognitionEngine(bus, coordination);
};
