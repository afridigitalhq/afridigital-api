import { socDashboardAPI } from "../dashboard/SOCDashboardAPI.js";

export class RootCauseAnalyzer {
  analyze(timeWindowMs = 300000) {
    const snapshot = socDashboardAPI.getLiveSnapshot();

    const events = (snapshot.recentEvents || []).filter(
      (e) => Date.now() - e.timestamp < timeWindowMs
    );

    const chains = [];

    for (let i = 0; i < events.length; i++) {
      const current = events[i];
      const next = events[i + 1];

      if (!next) break;

      const link = {
        from: current.type,
        to: next.type,
        timeGap: next.timestamp - current.timestamp
      };

      if (link.timeGap < 5000) {
        chains.push(link);
      }
    }

    const causes = chains.map((c) => {
      let hypothesis = "UNKNOWN_CAUSE";

      if (c.from === "CAMERA_SWITCH" && c.to === "ALERT") {
        hypothesis = "Camera reassignment triggered alert condition";
      }

      if (c.from === "ALERT" && c.to === "POLICY_TRIGGER") {
        hypothesis = "Security alert triggered policy enforcement";
      }

      if (c.from === "SYSTEM_LOAD" && c.to === "CAMERA_DROP") {
        hypothesis = "Resource saturation caused stream degradation";
      }

      return {
        chain: c,
        hypothesis
      };
    });

    return {
      generatedAt: Date.now(),
      totalEvents: events.length,
      chainsDetected: chains.length,
      hypotheses: causes
    };
  }
}

export const rootCauseAnalyzer = new RootCauseAnalyzer();
