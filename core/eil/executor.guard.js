let EXECUTION_ALLOWED = false;

function enableExecution(token) {
  if (!token || token !== process.env.EIL_TOKEN) {
    throw new Error("EIL: Unauthorized execution unlock");
  }
  EXECUTION_ALLOWED = true;
}

function assertExecution() {
  if (!EXECUTION_ALLOWED) {
    throw new Error("EIL: Execution blocked (isolation mode active)");
  }
}

function runSafeExecution(fn) {
  assertExecution();
  return fn();
}

module.exports = { enableExecution, assertExecution, runSafeExecution };
