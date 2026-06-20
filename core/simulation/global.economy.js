const bus = require('../eventbus');

const globalState = {
  jobsDemand: 0,
  earnSupply: 0,
  servicesDemand: 0,
  walletFlow: 0,
  users: 0
};

function updateGlobalState(event) {

  if (event.type === "JOB_VIEW") globalState.jobsDemand++;
  if (event.type === "EARN_COMPLETE") globalState.earnSupply++;
  if (event.type === "SERVICE_CLICK") globalState.servicesDemand++;
  if (event.type === "WALLET_TX") globalState.walletFlow++;

  bus.emit("GLOBAL_STATE_UPDATED", globalState);

  return globalState;
}

function getGlobalState() {
  return globalState;
}

module.exports = {
  updateGlobalState,
  getGlobalState
};
