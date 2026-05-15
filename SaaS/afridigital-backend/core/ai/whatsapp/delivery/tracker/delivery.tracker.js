/**
 * 📡 A3.18.13 DELIVERY TRACKER
 * Tracks message lifecycle state
 */

const states = new Map();

function setState(id, state) {
  states.set(id, {
    state,
    ts: Date.now()
  });
}

function getState(id) {
  return states.get(id);
}

module.exports = { setState, getState };
