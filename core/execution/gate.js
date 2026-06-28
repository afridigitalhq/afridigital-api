const { getState } = require("../kernel/unified.kernel");

function canExecute(action) {
  const state = getState();

  if (state === "CI_FAILED") {
    return { allowed: false, reason: "CI_FAILED_BLOCK" };
  }

  if (state === "ROLLBACK") {
    return { allowed: false, reason: "ROLLBACK_ACTIVE" };
  }

  return { allowed: true };
}

module.exports = { canExecute };
