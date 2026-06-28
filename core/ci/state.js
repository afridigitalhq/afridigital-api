let ciState = {
  deploy: "idle",
  lastBuild: null,
  safe: true
};

function updateState(partial) {
  ciState = { ...ciState, ...partial };
}

function getState() {
  return ciState;
}

module.exports = { updateState, getState };
