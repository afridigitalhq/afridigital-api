const { emit } = require("../../event-spine/ci.spine");

let lastGoodState = null;

function checkpoint(state) {
  lastGoodState = state;
  return state;
}

function rollback(reason) {
  const event = emit({
    type: "ROLLBACK_TRIGGERED",
    reason,
    restoredState: lastGoodState || "UNKNOWN"
  });

  return {
    success: true,
    restored: lastGoodState,
    event
  };
}

function getLastGoodState() {
  return lastGoodState;
}

module.exports = { checkpoint, rollback, getLastGoodState };
