const { getFlowGraph } = require("../flowgraph");
const { getPolicyFlowGraph } = require("../policy-visualization");
const { getControlCenterSnapshot } = require("../control-center-v2");
const { getStream } = require("../realtime-prediction-stream");

/**
 * 👑 Unified Admin Intelligence Console (DATA LAYER)
 * Aggregates ALL intelligence systems into one view
 */

function getAdminConsoleSnapshot() {

  return {
    flowgraph: getFlowGraph(),
    policy: getPolicyFlowGraph(),
    control: getControlCenterSnapshot(),
    predictions: getStream(),
    systemMode: "LIVE_INTELLIGENCE_COCKPIT",
    timestamp: Date.now()
  };
}

module.exports = {
  getAdminConsoleSnapshot
};
