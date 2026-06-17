export const DAG_EVENT_TYPES = {
  NODE_UPDATE: "NODE_UPDATE",
  NODE_FAIL: "NODE_FAIL",
  NODE_RECOVER: "NODE_RECOVER",
  KERNEL_STATE: "KERNEL_STATE",
  REGION_METRIC: "REGION_METRIC"
};

export function normalizeDagEvent(event) {
  if (!event) return null;

  return {
    id: event.id || crypto.randomUUID(),
    type: event.type || "NODE_UPDATE",
    status: event.status || "UNKNOWN",

    node: {
      id: event.node?.id || event.nodeId,
      region: event.node?.region || "default",
      latency: event.node?.latency || 0,
      load: event.node?.load || 0
    },

    trace: {
      correlationId: event.trace?.correlationId || null,
      source: event.trace?.source || "unknown"
    },

    timestamp: event.timestamp || Date.now(),

    meta: {
      version: "V12.5",
      sourceLayer: "frontend"
    }
  };
}
