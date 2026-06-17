export function buildSocLiveWall({
  health,
  alerts,
  anomalies,
  forecast,
  rca,
  security,
  incidents,
  federation
}) {
  return {
    timestamp: Date.now(),

    systemPulse: {
      state: health.systemState,
      successRate: health.successRate,
      risk: forecast?.prediction || "UNKNOWN"
    },

    threatMatrix: {
      alerts: alerts?.length || 0,
      anomalies: anomalies?.length || 0,
      securityLevel: security?.systemSecurityState || "UNKNOWN"
    },

    intelligenceFeed: {
      rootCause: rca?.causes?.[0] || null,
      incident: incidents?.[0] || null,
      recommendation: incidents?.[0]?.suggestion || "SYSTEM_STABLE"
    },

    clusterView: {
      regions: federation?.regions || {},
      globalNodes: federation?.globalNodeCount || 0,
      health: federation?.health || "UNKNOWN"
    },

    statusClass:
      health.systemState === "CRITICAL" || forecast?.prediction === "HIGH_RISK"
        ? "DANGER"
        : health.systemState === "DEGRADED"
        ? "WARNING"
        : "STABLE"
  };
}
