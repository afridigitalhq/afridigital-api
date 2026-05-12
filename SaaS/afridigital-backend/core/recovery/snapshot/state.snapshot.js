const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function saveSnapshot(state) {

  const snapshots =
    db.read('snapshot.db.json');

  snapshots.push({
    state,
    timestamp: Date.now()
  });

  db.write('snapshot.db.json', snapshots);
}

function getLastSnapshot() {

  const snapshots =
    db.read('snapshot.db.json');

  return snapshots[snapshots.length - 1];
}

module.exports = {
  saveSnapshot,
  getLastSnapshot
};
