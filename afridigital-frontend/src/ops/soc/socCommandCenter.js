export function buildSOCView({ events, alerts, anomalies, threats }) {
  return {
    systemStatus:
      threats?.length > 5 ? "CRITICAL" :
      alerts?.length > 3 ? "ELEVATED" :
      "STABLE",

    metrics: {
      totalEvents: events.length,
      alertCount: alerts.length,
      anomalyCount: anomalies.length,
      threatCount: threats.length
    },

    liveFeed: {
      latestEvent: events[events.length - 1] || null,
      latestAlert: alerts[alerts.length - 1] || null
    },

    posture: {
      security: threats?.length > 0 ? "UNDER_OBSERVATION" : "CLEAR",
      stability: anomalies?.length > 0 ? "UNSTABLE_ZONES_DETECTED" : "STABLE"
    }
  };
}
