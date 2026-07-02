const { getFlowGraph } = require("../flowgraph");
const { getStream } = require("../realtime-prediction-stream");

let controlState = {
  streamPaused: false,
  flaggedSignals: [],
  overrides: []
};

/**
 * 🧠 Admin Control Layer
 */
function pauseStream() {
  controlState.streamPaused = true;
}

function resumeStream() {
  controlState.streamPaused = false;
}

function flagSignal(signal) {
  controlState.flaggedSignals.push(signal);
}

function overrideDecision(decision) {
  controlState.overrides.push(decision);
}

/**
 * Fused intelligence output
 */
function getControlCenterSnapshot() {

  return {
    flowgraph: getFlowGraph(),
    predictions: controlState.streamPaused ? [] : getStream(),
    flaggedSignals: controlState.flaggedSignals,
    overrides: controlState.overrides,
    systemMode: controlState.streamPaused ? "PAUSED" : "LIVE"
  };
}

module.exports = {
  pauseStream,
  resumeStream,
  flagSignal,
  overrideDecision,
  getControlCenterSnapshot
};
