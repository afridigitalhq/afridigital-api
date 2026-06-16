function symbol(v) {
  // POSITIVE STATES
  if (v === true || v === "ONLINE" || v === "ACTIVE" || v === "VALID" || v === "PASS") return "🟢";
  
  // WARNING / UNKNOWN STATES
  if (
    v === "UNKNOWN" ||
    v === "DEGRADED" ||
    v === "PENDING" ||
    v === "OBS"
  ) return "🟡";

  // NEGATIVE STATES
  if (
    v === false ||
    v === "OFFLINE" ||
    v === "FAILED" ||
    v === "ERROR" ||
    v === "DOWN"
  ) return "🔴";

  return "⚪";
}

module.exports = symbol;
