const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function updateState(key, value) {

  const state =
    db.read('system.state.json');

  state[key] = value;

  db.write('system.state.json', state);
}

function getState(key) {

  const state =
    db.read('system.state.json');

  return state[key];
}

module.exports = {
  updateState,
  getState
};
