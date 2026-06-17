const ALLOWED = new Set([
  "dag:event",
  "kernel:update",
  "region:metric",
  "anomaly:detected"
]);

export function isValidEvent(e) {
  return e && ALLOWED.has(e.type) && e.id && e.timestamp;
}

export function safeEmit(handler, event) {
  if (isValidEvent(event)) handler(event);
}
