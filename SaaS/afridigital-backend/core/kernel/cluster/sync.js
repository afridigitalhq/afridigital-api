const fs = require("fs");
const path = require("path");

const SYNC_FILE = path.join(__dirname, "cluster_state.json");

function readState() {
  if (!fs.existsSync(SYNC_FILE)) return {};
  return JSON.parse(fs.readFileSync(SYNC_FILE, "utf-8"));
}

function writeState(state) {
  fs.writeFileSync(SYNC_FILE, JSON.stringify(state, null, 2));
}

/**
 * Merge distributed state
 */
function syncState(nodeId, payload) {
  const state = readState();

  state[nodeId] = {
    ...payload,
    updatedAt: Date.now()
  };

  writeState(state);
  return state;
}

/**
 * Get cluster view
 */
function getClusterState() {
  return readState();
}

module.exports = {
  syncState,
  getClusterState
};
