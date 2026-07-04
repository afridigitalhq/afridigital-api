export class SOCDecisionArbitrationEngine {
  constructor(governance, stateEngine, eventBus) {
    this.governance = governance;
    this.stateEngine = stateEngine;
    this.eventBus = eventBus;
  }

  resolve(context) {
    const governance = this.governance.evaluate(context);
    const state = this.stateEngine.snapshot();

    const signals = this._collectSignals(context);

    const prioritized = signals
      .filter(s => this._isAllowed(governance, s))
      .sort((a, b) => b.priority - a.priority);

    const decision = {
      timestamp: Date.now(),
      allowed: governance.allowed,
      topSignal: prioritized[0] || null,
      allSignals: prioritized,
      state
    };

    this.eventBus.emit("SOC_ARBITRATION_DECISION", decision);

    return decision;
  }

  _collectSignals(context) {
    return [
      ...(context.predictionSignals || []),
      ...(context.optimizationSignals || []),
      ...(context.metaSignals || [])
    ].map(s => ({
      ...s,
      priority: s.priority || 0.5
    }));
  }

  _isAllowed(governance, signal) {
    return governance.allowed;
  }
}

export const createDecisionArbitrationEngine = (gov, state, bus) => {
  return new SOCDecisionArbitrationEngine(gov, state, bus);
};
