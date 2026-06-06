const { updateGlobalState } = require("./global.economy");

function hookEvent(event) {
  return updateGlobalState(event);
}

module.exports = { hookEvent };
