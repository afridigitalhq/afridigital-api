// 🔮 SOC → VISUAL DEFORMATION BRIDGE

export function mapSOCToVisual(event) {
  const severityMap = {
    low: 0.2,
    medium: 0.5,
    high: 0.8,
    critical: 1.0
  };

  return {
    nodeStress: severityMap[event.severity] || 0.1,
    heat: event.severity === "critical" ? 1 : 0,
    pulse: event.type === "failure" ? 1 : 0,
    distortion: event.impact || 0.3
  };
}
