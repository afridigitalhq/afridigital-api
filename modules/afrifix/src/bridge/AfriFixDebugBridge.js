export function receiveAfriDebugEvidence(evidence) {
  return {
    source: "AfriDebug",
    received: true,
    evidence,
    timestamp: new Date().toISOString()
  };
}
