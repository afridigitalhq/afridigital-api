// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { readLedger } = require("./event.ledger");

function buildState() {
  const events = readLedger();

  return events.reduce((state, event) => {
    switch (event.type) {
      case "DEPLOY_REQUEST":
        state.deploys = (state.deploys || 0) + 1;
        break;

      case "FLAG_UPDATE":
        state.flags = state.flags || {};
        state.flags[event.key] = event.value;
        break;

      case "ROLLBACK":
        state.rollbacks = (state.rollbacks || 0) + 1;
        break;
    }

    return state;
  }, {});
}

module.exports = { buildState };
