export class SOCDigitalTwinEngine {
  constructor(stateEngine, eventBus, metaEngine, predictionEngine) {
    this.stateEngine = stateEngine;
    this.eventBus = eventBus;
    this.metaEngine = metaEngine;
    this.predictionEngine = predictionEngine;

    this.snapshots = [];
    this.simulations = [];
  }

  captureSnapshot() {
    const snapshot = this.stateEngine.snapshot();

    this.snapshots.push(JSON.parse(JSON.stringify(snapshot)));

    return snapshot;
  }

  replayLast(n = 20) {
    const history = this.snapshots.slice(-n);

    const replay = history.map((s, i) => ({
      step: i,
      state: s,
      reconstructedRisk: s.intelligence?.predictionRisk || 0
    }));

    this.eventBus.emit("SOC_DIGITAL_TWIN_REPLAY", replay);

    return replay;
  }

  simulateScenario(modifierFn) {
    const base = this.captureSnapshot();

    const modified = modifierFn
      ? modifierFn(JSON.parse(JSON.stringify(base)))
      : base;

    const simulation = {
      original: base,
      modified,
      comparison: this._compare(base, modified),
      timestamp: Date.now()
    };

    this.simulations.push(simulation);

    this.eventBus.emit("SOC_DIGITAL_TWIN_SIMULATION", simulation);

    return simulation;
  }

  _compare(a, b) {
    return {
      healthDelta: (b.systemOverview?.health || 0) - (a.systemOverview?.health || 0),
      riskDelta: (b.intelligence?.predictionRisk || 0) - (a.intelligence?.predictionRisk || 0)
    };
  }
}

export const createDigitalTwin = (stateEngine, bus, meta, prediction) => {
  return new SOCDigitalTwinEngine(stateEngine, bus, meta, prediction);
};
