let state = {
  withdrawalsFrozen: false
};

function freezeWithdrawals() {
  state.withdrawalsFrozen = true;
}

function unfreezeWithdrawals() {
  state.withdrawalsFrozen = false;
}

function isFrozen() {
  return state.withdrawalsFrozen;
}

function getStatus() {
  return state.withdrawalsFrozen ? "FROZEN" : "ACTIVE";
}

module.exports = {
  freezeWithdrawals,
  unfreezeWithdrawals,
  isFrozen,
  getStatus
};

// 🚨 AUTO-FREEZE INTELLIGENCE

function autoFreezeIfNeeded(fraud) {
  if (!fraud || !fraud.flagged) return false;

  if (fraud.riskScore >= 85) {
    state.withdrawalsFrozen = true;
    state.autoFrozen = true;
    return "AUTO_FROZEN";
  }

  return "MONITORED";
}

function getStatus() {
  return {
    withdrawalsFrozen: state.withdrawalsFrozen,
    autoFrozen: state.autoFrozen || false
  };
}

module.exports.autoFreezeIfNeeded = autoFreezeIfNeeded;
module.exports.getStatus = getStatus;

