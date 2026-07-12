const store = require("./plugin.subscription.store");

let state = store.load() || {};

function subscribe(moduleId, eventType) {
  if (!state[eventType]) state[eventType] = [];

  if (!state[eventType].includes(moduleId)) {
    state[eventType].push(moduleId);
  }

  store.save(state);
}

function snapshot() {
  return state;
}

module.exports = { subscribe, snapshot };