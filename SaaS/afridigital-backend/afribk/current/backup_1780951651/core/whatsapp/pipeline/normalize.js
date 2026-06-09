module.exports = function normalize(payload = {}) {
  return {
    text: payload.text || payload.message || "",
    from: payload.from || "unknown",
    raw: payload
  };
};
