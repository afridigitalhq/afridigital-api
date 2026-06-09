/**
 * 🧠 AFRISCAN EVENT SCHEMA
 * normalized output for WS + React graph
 */

function normalize(type, payload = {}) {
  return {
    id: Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    type,
    payload,
    ts: Date.now()
  };
}

module.exports = {
  normalize
};
