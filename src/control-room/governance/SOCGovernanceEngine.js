export class SOCGovernanceEngine {
  constructor(eventBus, stateEngine) {
    this.eventBus = eventBus;
    this.stateEngine = stateEngine;

    this.rules = [
      {
        id: "NO_ACTION_ON_HIGH_RISK",
        check: (ctx) => ctx.predictionRisk > 0.75,
        action: "BLOCK_AUTOPILOT"
      },
      {
        id: "STATE_IS_SOURCE_OF_TRUTH",
        check: () => true,
        action: "PREVENT_STATE_OVERRIDE"
      },
      {
        id: "SIMULATION_ISOLATION",
        check: (ctx) => ctx.mode === "SIMULATION",
        action: "BLOCK_PRODUCTION_WRITE"
      }
    ];
  }

  evaluate(context) {
    const violations = [];

    for (const rule of this.rules) {
      if (rule.check(context)) {
        violations.push(rule);
      }
    }

    const decision = {
      timestamp: Date.now(),
      allowed: violations.length === 0,
      violations,
      context
    };

    this.eventBus.emit("SOC_GOVERNANCE_DECISION", decision);

    return decision;
  }
}

export const createGovernanceEngine = (bus, state) => {
  return new SOCGovernanceEngine(bus, state);
};
