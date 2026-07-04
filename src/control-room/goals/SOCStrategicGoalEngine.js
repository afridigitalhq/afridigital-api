export class SOCStrategicGoalEngine {
  constructor(stateEngine, metaEngine, predictionEngine, eventBus) {
    this.stateEngine = stateEngine;
    this.metaEngine = metaEngine;
    this.predictionEngine = predictionEngine;
    this.eventBus = eventBus;

    this.goals = [
      { id: "STABILITY", target: 0.85 },
      { id: "LOW_RISK", target: 0.2 },
      { id: "HIGH_THROUGHPUT", target: 0.8 }
    ];
  }

  evaluate() {
    const state = this.stateEngine.snapshot();
    const meta = this.metaEngine.getTrends();
    const prediction = this.predictionEngine.getHistory?.()?.slice(-1)[0];

    const evaluation = this.goals.map(goal => {
      return {
        goal: goal.id,
        target: goal.target,
        actual: this._measure(goal.id, state, meta, prediction),
        delta: 0
      };
    }).map(g => {
      g.delta = g.actual - g.target;
      return g;
    });

    this.eventBus.emit("SOC_GOAL_EVALUATION", evaluation);

    return evaluation;
  }

  _measure(goalId, state, meta, prediction) {
    switch (goalId) {
      case "STABILITY":
        return meta?.averageScore || 0;
      case "LOW_RISK":
        return 1 - (prediction?.riskScore || 0);
      case "HIGH_THROUGHPUT":
        return state.execution?.flowUsage
          ? Object.values(state.execution.flowUsage).reduce((a,b)=>a+b,0) / 100
          : 0;
      default:
        return 0;
    }
  }
}

export const createStrategicGoalEngine = (state, meta, prediction, bus) => {
  return new SOCStrategicGoalEngine(state, meta, prediction, bus);
};
