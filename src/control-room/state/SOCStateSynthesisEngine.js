export class SOCStateSynthesisEngine {
  constructor({ meta, flow, prediction, coordination, eventBus }) {
    this.meta = meta;
    this.flow = flow;
    this.prediction = prediction;
    this.coordination = coordination;
    this.eventBus = eventBus;
  }

  snapshot() {
    const meta = this.meta?.getTrends?.();
    const flow = this.flow?.getStatus?.();
    const prediction = this.prediction?.getHistory?.()?.slice(-1)[0];
    const routing = this.coordination?.getRoutingTable?.();

    const state = {
      timestamp: Date.now(),

      systemOverview: {
        health: this._deriveHealth(meta, flow),
        stability: meta?.trend || "UNKNOWN",
        mode: this._deriveMode(prediction)
      },

      intelligence: {
        meta,
        predictionRisk: prediction?.riskScore || 0,
        predictionStatus: prediction?.status || "UNKNOWN"
      },

      execution: {
        flowUsage: flow?.usage || {},
        routingTable: routing
      },

      insights: this._generateInsights(meta, prediction)
    };

    this.eventBus?.emit?.("SOC_STATE_SNAPSHOT", state);

    return state;
  }

  _deriveHealth(meta, flow) {
    if (!meta || !flow) return "UNKNOWN";

    const score = meta.averageScore || 0;

    if (score > 0.8) return "HEALTHY";
    if (score > 0.5) return "STABLE";
    return "DEGRADED";
  }

  _deriveMode(prediction) {
    if (!prediction) return "NORMAL";

    if (prediction.riskScore > 0.75) return "HIGH_ALERT";
    if (prediction.riskScore > 0.4) return "WATCH";

    return "NORMAL";
  }

  _generateInsights(meta, prediction) {
    const insights = [];

    if (meta?.trend === "DEGRADING") {
      insights.push("System performance declining");
    }

    if (prediction?.riskScore > 0.75) {
      insights.push("High risk of system stress detected");
    }

    if (meta?.trend === "IMPROVING") {
      insights.push("System stability improving");
    }

    return insights;
  }
}

export const createStateSynthesisEngine = (deps) => {
  return new SOCStateSynthesisEngine(deps);
};
