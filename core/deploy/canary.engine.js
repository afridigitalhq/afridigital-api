let lastStable = "v1";

function deployCanary(version) {
  return { status: "CANARY_DEPLOYED", version };
}

function rollback() {
  return { status: "ROLLBACK_EXECUTED", version: lastStable };
}

module.exports = { deployCanary, rollback };
