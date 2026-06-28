// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { emit } = require("../spine/ci.spine");

const STATE = {
  IDLE: "IDLE",
  PR_OPEN: "PR_OPEN",
  CI_RUNNING: "CI_RUNNING",
  CI_PASSED: "CI_PASSED",
  CI_FAILED: "CI_FAILED",
  DEPLOYING: "DEPLOYING",
  DEPLOYED: "DEPLOYED",
  ROLLBACK: "ROLLBACK"
};

let currentState = STATE.IDLE;

function transition(next, meta = {}) {
  currentState = next;

  emit({
    type: "STATE_TRANSITION",
    from: currentState,
    to: next,
    meta
  });

  return currentState;
}

function getState() {
  return currentState;
}

module.exports = { STATE, transition, getState };
