// PHASE 2: PREDICTIVE DAG ENGINE

export function predictFailure(dagState) {
  const risk =
    (dagState.latency || 0) * 0.4 +
    (dagState.packetLoss || 0) * 0.4 +
    (dagState.nodePressure || 0) * 0.2;

  return {
    risk,
    status:
      risk > 0.7 ? "critical" :
      risk > 0.4 ? "warning" : "stable"
  };
}
