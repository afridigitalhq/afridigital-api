const snapshots = [];

function snapshot(event) {
  snapshots.push({
    id: Date.now().toString(36),
    event,
    ts: Date.now()
  });
}

function getSnapshots() {
  return snapshots;
}

module.exports = { snapshot, getSnapshots };
