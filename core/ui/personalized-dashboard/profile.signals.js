function extractSignals(user) {

  return {
    role: user.role || "guest",
    walletActivity: user.walletActivity || 0,
    jobActivity: user.jobActivity || 0,
    boostActivity: user.boostActivity || 0,
    earningsActivity: user.earningsActivity || 0,
    copilotUsage: user.copilotUsage || 0
  };
}

module.exports = { extractSignals };
