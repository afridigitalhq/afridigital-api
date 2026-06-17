const ALLOWED_TYPES = [
  "dag:event",
  "kernel:update",
  "region:metric",
  "anomaly:detected"
];

function validateEvent(event) {
  return (
    event &&
    typeof event === "object" &&
    ALLOWED_TYPES.includes(event.type) &&
    event.id &&
    event.timestamp
  );
}

function emitStrict(io, event) {
  if (!validateEvent(event)) return;
  io.emit(event.type, event);
}

module.exports = { validateEvent, emitStrict };
