function normalizeMessage(payload) {
  return {
    id: payload.id || Date.now().toString(),
    from: payload.from,
    text: payload.text || "",
    timestamp: Date.now()
  };
}

module.exports = { normalizeMessage };
