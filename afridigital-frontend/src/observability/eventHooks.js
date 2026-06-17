export const eventMap = {
  NODE_OK: "🟢",
  NODE_DEGRADED: "🟡",
  NODE_FAILED: "🔴"
};

export function normalizeEvent(e) {
  return {
    id: e.id,
    status: e.status,
    symbol: eventMap[e.status] || "⚪",
    timestamp: e.timestamp,
    raw: e
  };
}
