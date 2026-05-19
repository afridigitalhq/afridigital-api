const ledger = require("../ledger/wallet.ledger");

function rebuildState(reducer) {
  const events = ledger.getAllEvents();
  return events.reduce((state, event) => reducer(state, event), {});
}

module.exports = { rebuildState };
