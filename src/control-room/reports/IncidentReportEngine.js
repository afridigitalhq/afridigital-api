import { aiExplanationEngine } from "../explain/AIExplanationEngine.js";
import { socDashboardAPI } from "../dashboard/SOCDashboardAPI.js";

export class IncidentReportEngine {
  generate(timeWindowMs = 300000) {
    const snapshot = socDashboardAPI.getLiveSnapshot();

    const events = (snapshot.recentEvents || []).filter(
      (e) => Date.now() - e.timestamp < timeWindowMs
    );

    const enriched = events.map((event) => {
      const explanation = aiExplanationEngine.explain(event);

      return {
        ...event,
        explanation
      };
    });

    const severityCount = enriched.reduce(
      (acc, e) => {
        const level = e.severity || "LOW";
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      },
      {}
    );

    const report = {
      generatedAt: Date.now(),
      timeWindowMs,
      systemStatus: snapshot.systemStatus,
      activeLoad: snapshot.activeLoad,
      summary: {
        totalEvents: enriched.length,
        severityBreakdown: severityCount
      },
      events: enriched
    };

    return report;
  }
}

export const incidentReportEngine = new IncidentReportEngine();
