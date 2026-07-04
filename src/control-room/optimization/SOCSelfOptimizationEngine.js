export class SOCSelfOptimizationEngine {
  constructor(eventBus, metaEngine, flowController, coordination) {
    this.eventBus = eventBus;
    this.meta = metaEngine;
    this.flow = flowController;
    this.coordination = coordination;

    this.thresholds = {
      lowPerformance: 0.6,
      unstableTrend: true
    };
  }

  evaluate() {
    const trends = this.meta.getTrends();
    if (!trends) return null;

    const recommendations = [];

    if (trends.averageScore < this.thresholds.lowPerformance) {
      recommendations.push({
        type: "TUNE_FLOW_LIMITS",
        reason: "Low system performance detected",
        suggestion: "Reduce NORMAL priority throughput"
      });
    }

    if (trends.trend === "DEGRADING") {
      recommendations.push({
        type: "REBALANCE_COORDINATION",
        reason: "System performance degrading over time",
        suggestion: "Review event routing distribution"
      });
    }

    if (trends.trend === "IMPROVING") {
      recommendations.push({
        type: "STABILIZE_CURRENT_CONFIG",
        reason: "System performing well",
        suggestion: "Maintain current thresholds"
      });
    }

    this.eventBus.emit("SOC_OPTIMIZATION_REPORT", {
      timestamp: Date.now(),
      trends,
      recommendations
    });

    return recommendations;
  }

  getLastAnalysis(metaEngine) {
    return metaEngine.getTrends();
  }
}

export const createSelfOptimizationEngine = (bus, meta, flow, coord) => {
  return new SOCSelfOptimizationEngine(bus, meta, flow, coord);
};
