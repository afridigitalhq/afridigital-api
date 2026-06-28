// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const STATE = {
  PRs: {},
  CI: {},
  DEPLOY: "idle"
};

function updateState(partial) {
  Object.assign(STATE, partial);
}

function getState() {
  return STATE;
}

module.exports = { updateState, getState };
