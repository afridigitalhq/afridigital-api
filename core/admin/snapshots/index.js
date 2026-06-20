/**
 * 📦 Snapshot Storage Engine
 * Captures system state before execution
 */

const snapshots = [];

function createSnapshot(state) {

  const snap = {
    id: Date.now(),
    state: JSON.parse(JSON.stringify(state)),
    timestamp: Date.now()
  };

  snapshots.push(snap);
  return snap.id;
}

function getSnapshot(id) {
  return snapshots.find(s => s.id === id);
}

function getLatestSnapshot() {
  return snapshots[snapshots.length - 1];
}

module.exports = {
  createSnapshot,
  getSnapshot,
  getLatestSnapshot
};
