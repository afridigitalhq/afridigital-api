export class SOCObservabilityEngine {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.traces = [];
  }

  record(decisionContext) {
    const trace = {
      timestamp: Date.now(),
      inputs: decisionContext.inputs || {},
      signals: decisionContext.signals || [],
      governance: decisionContext.governance || null,
      arbitration: decisionContext.arbitration || null,
      output: decisionContext.output || null
    };

    this.traces.push(trace);

    this.eventBus.emit("SOC_TRACE_RECORD", trace);

    return trace;
  }

  replay(last = 20) {
    return this.traces.slice(-last);
  }

  explain(decisionId) {
    return this.traces.find(t => t.output?.id === decisionId) || null;
  }
}

export const createObservabilityEngine = (bus) => {
  return new SOCObservabilityEngine(bus);
};
