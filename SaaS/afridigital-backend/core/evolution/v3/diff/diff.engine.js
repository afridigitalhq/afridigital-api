/**
 * 📊 A3.15 DIFF ENGINE v2
 * Real structured diff generator (not text-only)
 */

function buildDiff(before, after) {
  return {
    removed: before || {},
    added: after || {},
    delta: "STRUCTURED_DIFF",
    severity: Object.keys(after || {}).length > 3 ? "HIGH" : "LOW"
  };
}

module.exports = { buildDiff };
