export class SOCPredictiveFailureEngine {
  constructor(eventBus, metaEngine, flowController) {
    this.eventBus = eventBus;
    this.meta = metaEngine;
    this.flow = flowController;

    this.history = [];
  }

  analyze() {
    const trends = this.meta.getTrends();
    const flow = this.flow.getStatus();

    if (!trends || !flow) return null;

    const riskScore = this._calculateRisk(trends, flow);

    const prediction = {
      timestamp: Date.now(),
      riskScore,
      status: this._interpretRisk(riskScore),
      signals: this._generateSignals(riskScore, trends, flow)
    };

    this.history.push(prediction);

    this.eventBus.emit("SOC_PREDICTION_UPDATE", prediction);

    return prediction;
  }

  _calculateRisk(trends, flow) {
    const base = 1 - (trends.averageScore || 0);

    const flowPressure = (
      flow.usage.CRITICAL +
      flow.usage.HIGH +
      flow.usage.NORMAL
    ) / 100;

    return Math.min(1, base * 0.6 + flowPressure * 0.4);
  }

  _interpretRisk(score) {
    if (score > 0.75) return "HIGH_RISK";
    if (score > 0.4) return "MEDIUM_RISK";
    return "LOW_RISK";
  }

  _generateSignals(score, trends, flow) {
    const signals = [];

    if (score > 0.75) {
      signals.push("SYSTEM_STRESS_IMMINENT");
    }

    if (trends.trend === "DEGRADING") {
      signals.push("COGNITIVE_DEGRADATION_TREND");
    }

    if (flow.usage.CRITICAL > 30) {
      signals.push("CRITICAL_FLOW_PRESSURE");
    }

    return signals;
  }

  getHistory() {
    return this.history.slice(-50);
  }
}

export const createPredictiveEngine = (bus, meta, flow) => {
  return new SOCPredictiveFailureEngine(bus, meta, flow);
};
