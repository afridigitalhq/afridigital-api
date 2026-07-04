export class SOCExecutionOrchestrator {
  constructor({ state, prediction, governance, arbitration, observability, eventBus }) {
    this.state = state;
    this.prediction = prediction;
    this.governance = governance;
    this.arbitration = arbitration;
    this.observability = observability;
    this.eventBus = eventBus;
  }

  tick(context = {}) {
    const snapshot = this.state.snapshot();

    const prediction = this.prediction.analyze?.() || null;

    const governance = this.governance.evaluate({ ...context, predictionRisk: prediction?.riskScore });

    const arbitration = this.arbitration.resolve({
      predictionSignals: prediction?.signals || [],
      optimizationSignals: context.optimizationSignals || [],
      metaSignals: context.metaSignals || []
    });

    const decision = arbitration.topSignal;

    const trace = this.observability.record({
      inputs: context,
      signals: arbitration.allSignals,
      governance,
      arbitration,
      output: decision
    });

    const cycle = {
      snapshot,
      prediction,
      governance,
      arbitration,
      decision,
      trace
    };

    this.eventBus.emit("SOC_CYCLE_COMPLETE", cycle);

    return cycle;
  }
}

export const createSOCExecutionOrchestrator = (deps) => {
  return new SOCExecutionOrchestrator(deps);
};
