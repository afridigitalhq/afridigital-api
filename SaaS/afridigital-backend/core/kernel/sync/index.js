const fs = require("fs");
const path = require("path");

const SYNC_FILE = path.join(__dirname, "state.json");

function writeState(state) {
  fs.writeFileSync(SYNC_FILE, JSON.stringify(state, null, 2));
}

function readState() {
  if (!fs.existsSync(SYNC_FILE)) return {};
  return JSON.parse(fs.readFileSync(SYNC_FILE, "utf-8"));
}

/**
 * Merge execution state (multi-node safe model)
 */
function mergeState(newState) {
  const current = readState();
  const merged = {
    ...current,
    ...newState,
    updatedAt: Date.now()
  };

  writeState(merged);
  return merged;
}

module.exports = {
  writeState,
  readState,
  mergeState
};
