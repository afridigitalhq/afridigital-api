import { socPolicyEngine } from "../policy/SOCPolicyEngine.js";
import { incidentReplayEngine } from "../../evidence/replay/IncidentReplayEngine.js";

export class SOCPolicyOptimizer {
  constructor() {
    this.replay = incidentReplayEngine;
    this.policyEngine = socPolicyEngine;
  }

  analyze() {
    const timeline = this.replay.getTimeline();

    const stats = {
      totalEvents: timeline.length,
      cases: 0,
      responses: 0,
      highSeverity: 0
    };

    for (const event of timeline) {
      if (event.type === "CASE_CREATED") stats.cases++;
      if (event.type === "AUTO_RESPONSE_EXECUTED") stats.responses++;

      if (event.payload?.severity === "HIGH" || event.payload?.severity === "CRITICAL") {
        stats.highSeverity++;
      }
    }

    return {
      summary: "Policy optimization analysis completed",
      stats,
      recommendations: this.generateRecommendations(stats)
    };
  }

  generateRecommendations(stats) {
    const recs = [];

    if (stats.highSeverity > stats.responses) {
      recs.push({
        issue: "High severity incidents not fully automated",
        suggestion: "Add AUTO_RESPONSE rules for CRITICAL events"
      });
    }

    if (stats.cases > 10 && stats.responses < 5) {
      recs.push({
        issue: "Low response automation coverage",
        suggestion: "Increase policy coverage for CASE_CREATED events"
      });
    }

    if (stats.responses > stats.cases) {
      recs.push({
        issue: "Over-aggressive automation risk",
        suggestion: "Add stricter policy conditions to prevent over-triggering"
      });
    }

    return recs;
  }
}

export const socPolicyOptimizer = new SOCPolicyOptimizer();
