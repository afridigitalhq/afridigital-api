function detectRollbackNeed(events) {
  const failures = events.filter(e => e.type === "CI_FAILED").length;

  return {
    rollbackRecommended: failures > 0,
    reason: failures > 0 ? "CI_FAILURE_DETECTED" : null
  };
}

module.exports = { detectRollbackNeed };
