import { socMetricsEngine } from "../metrics/SOCMetricsEngine.js";
import { incidentReplayEngine } from "../../evidence/replay/IncidentReplayEngine.js";

export class SOCDashboardAPI {
  constructor(eventBus) {
    this.eventBus = eventBus;
  }

  getLiveSnapshot() {
    const metrics = socMetricsEngine.calculate();
    const timeline = incidentReplayEngine.getTimeline();

    return {
      timestamp: Date.now(),
      metrics,
      recentEvents: timeline.slice(-20),
      systemStatus: this._deriveStatus(metrics),
      activeLoad: this._getActiveLoad(timeline)
    };
  }

  _deriveStatus(metrics) {
    if (metrics.automationRate > 0.7 && metrics.avgResponseTime < 3000) {
      return "OPTIMAL";
    }

    if (metrics.automationRate > 0.4) {
      return "STABLE";
    }

    return "DEGRADED";
  }

  _getActiveLoad(timeline) {
    const lastMinute = Date.now() - 60000;

    return timeline.filter(e => e.timestamp >= lastMinute).length;
  }

  stream(callback, interval = 2000) {
    setInterval(() => {
      callback(this.getLiveSnapshot());
    }, interval);
  }
}

export const socDashboardAPI = new SOCDashboardAPI();
