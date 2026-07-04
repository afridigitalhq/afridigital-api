import { incidentReplayEngine } from "../../evidence/replay/IncidentReplayEngine.js";

export class SOCMetricsEngine {
  constructor() {
    this.replay = incidentReplayEngine;
  }

  calculate() {
    const timeline = this.replay.getTimeline();

    const metrics = {
      totalEvents: timeline.length,
      casesCreated: 0,
      responsesExecuted: 0,
      clipsGenerated: 0,
      avgResponseTime: 0,
      automationRate: 0
    };

    const responseTimes = [];

    const caseTimes = new Map();

    for (const event of timeline) {
      if (event.type === "CASE_CREATED") {
        metrics.casesCreated++;
        caseTimes.set(event.payload?.id, event.timestamp);
      }

      if (event.type === "AUTO_RESPONSE_EXECUTED") {
        metrics.responsesExecuted++;

        const caseId = event.payload?.caseId;
        const start = caseTimes.get(caseId);

        if (start) {
          responseTimes.push(event.timestamp - start);
        }
      }

      if (event.type === "CLIP_GENERATED") {
        metrics.clipsGenerated++;
      }
    }

    metrics.avgResponseTime = responseTimes.length
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    metrics.automationRate = metrics.casesCreated
      ? metrics.responsesExecuted / metrics.casesCreated
      : 0;

    return metrics;
  }

  report() {
    const m = this.calculate();

    return {
      status: "SOC PERFORMANCE REPORT",
      metrics: m,
      healthScore: this._score(m)
    };
  }

  _score(m) {
    let score = 100;

    if (m.automationRate < 0.5) score -= 30;
    if (m.avgResponseTime > 5000) score -= 20;
    if (m.casesCreated > 0 && m.responsesExecuted === 0) score -= 40;

    return Math.max(score, 0);
  }
}

export const socMetricsEngine = new SOCMetricsEngine();
