const STATE = {
  IDLE: "IDLE",
  PR_OPEN: "PR_OPEN",
  CI_RUNNING: "CI_RUNNING",
  CI_FAILED: "CI_FAILED",
  CI_PASSED: "CI_PASSED",
  QUORUM_WAITING: "QUORUM_WAITING",
  DEPLOYING: "DEPLOYING",
  DEPLOYED: "DEPLOYED",
  ROLLBACK: "ROLLBACK"
};

let current = STATE.IDLE;

function transition(next) {
  current = next;
  return current;
}

function getState() {
  return current;
}

module.exports = { STATE, transition, getState };
