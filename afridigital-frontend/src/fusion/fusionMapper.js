export function mapFusionState({ soc, heatmap, anomalies, rca, forecast }) {
  const nodeOverlays = {};

  // Heatmap intensity per node
  Object.keys(heatmap || {}).forEach(nodeId => {
    nodeOverlays[nodeId] = {
      heat: heatmap[nodeId].score || 0,
      anomalies: 0,
      risk: "LOW"
    };
  });

  // Inject anomalies into node overlay
  (anomalies || []).forEach(a => {
    if (a.node && nodeOverlays[a.node]) {
      nodeOverlays[a.node].anomalies += 1;
      nodeOverlays[a.node].risk = a.severity || "MEDIUM";
    }
  });

  // Inject RCA signals
  (rca?.causes || []).forEach(c => {
    const target = c.likely_source;
    if (nodeOverlays[target]) {
      nodeOverlays[target].risk = "HIGH";
      nodeOverlays[target].rca = c.type;
    }
  });

  return {
    nodeOverlays,
    systemRisk:
      forecast?.prediction === "HIGH_RISK"
        ? "CRITICAL"
        : forecast?.prediction === "MEDIUM_RISK"
        ? "WARNING"
        : "STABLE",

    socState: soc?.systemStatus || "UNKNOWN"
  };
}
