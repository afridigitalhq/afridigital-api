const fs = require('fs');
const path = require('path');

const SNAPSHOT_FILE = path.join(process.cwd(), 'core/kernel/v2/control-plane/snapshot.json');

const state = {
  versions: {},
  history: [],
  active: {},
};

function snapshot() {
  fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(state, null, 2));
  return state;
}

function registerPlugin(name, version) {
  state.versions[name] = version;
  state.history.push({ name, version, ts: Date.now() });
  snapshot();
  return true;
}

function getVersion(name) {
  return state.versions[name] || null;
}

function rollback(name) {
  const last = [...state.history].reverse().find(p => p.name === name);
  if (!last) return false;

  state.versions[name] = last.version;
  snapshot();
  return last.version;
}

function getState() {
  return state;
}

module.exports = {
  registerPlugin,
  getVersion,
  rollback,
  getState,
  snapshot
};
