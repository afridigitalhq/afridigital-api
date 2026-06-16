const { getClusterState } = require("./sync");

/**
 * Pick healthiest node
 */
function electNode() {
  const state = getClusterState();

  let best = null;

  for (const [id, info] of Object.entries(state)) {
    if (!best || (info.load || 0) < (best.load || 0)) {
      best = { id, ...info };
    }
  }

  return best;
}

/**
 * Check if current node should take over
 */
function shouldTakeOver(currentNodeId) {
  const leader = electNode();
  return !leader || leader.id === currentNodeId;
}

module.exports = {
  electNode,
  shouldTakeOver
};
