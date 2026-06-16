module.exports = function dot(v) {
  if (v === true || v === "ONLINE" || v === "ACTIVE" || v === "VALID") return "🟢";
  if (v === "UNKNOWN" || v === "DEGRADED") return "🟡";
  if (v === "FAILED" || v === "OFFLINE" || v === false) return "🔴";
  return "⚪";
};
