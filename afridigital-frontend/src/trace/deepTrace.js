export function buildExecutionTrace(events, nodeId) {
  const trace = [];

  for (const e of events) {
    if (e.node === nodeId) {
      trace.push({
        step: trace.length,
        type: e.type,
        status: e.status,
        latency: e.latency,
        timestamp: e.ts
      });
    }
  }

  return {
    nodeId,
    steps: trace,
    totalSteps: trace.length,
    avgLatency:
      trace.reduce((a, b) => a + (b.latency || 0), 0) / (trace.length || 1)
  };
}
