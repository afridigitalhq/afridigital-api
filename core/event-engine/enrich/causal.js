function addCausal(event) {
  return {
    ...event,
    origin: event.type === "security" ? "suspected_root" : "unknown"
  };
}

module.exports = { addCausal };
