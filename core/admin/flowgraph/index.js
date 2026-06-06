const bus = require("../../eventbus");

/**
 * 🧠 Admin FlowGraph Live Intelligence Engine
 * (VISUALIZATION ONLY - NO ACTIONS)
 */

const graph = [];
const replayStore = [];

/**
 * Capture all system events into graph nodes
 */
bus.on("EARN", (data) => {

  const node = {
    type: "EVENT",
    label: "EARN",
    userId: data.userId,
    value: data.amount,
    time: Date.now()
  };

  graph.push(node);
  replayStore.push(node);
});

bus.on("SPEND", (data) => {

  const node = {
    type: "EVENT",
    label: "SPEND",
    userId: data.userId,
    value: data.amount,
    time: Date.now()
  };

  graph.push(node);
  replayStore.push(node);
});

/**
 * Prediction node injection (from your streaming layer)
 */
function addPredictionNode(prediction) {

  const node = {
    type: "PREDICTION",
    label: prediction.marketTrend,
    jobForecast: prediction.jobForecast,
    earningsForecast: prediction.earningsForecast,
    confidence: prediction.confidence,
    time: Date.now()
  };

  graph.push(node);
  replayStore.push(node);
}

/**
 * LIVE GRAPH OUTPUT (ADMIN ONLY)
 */
function getFlowGraph() {
  return graph.slice(-100);
}

/**
 * REPLAY MODE ENGINE (TIME TRAVEL)
 */
function replay(fromTime, toTime) {

  return replayStore.filter(n =>
    n.time >= fromTime && n.time <= toTime
  );
}

module.exports = {
  getFlowGraph,
  replay,
  addPredictionNode
};
