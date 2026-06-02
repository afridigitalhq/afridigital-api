const snapshots = [];

function saveSnapshot(state) {
  const snap = {
    id: Date.now().toString(36),
    state,
    ts: Date.now()
  };
  snapshots.push(snap);
  return snap;
}

function getSnapshots() {
  return snapshots;
}

module.exports = { saveSnapshot, getSnapshots };
