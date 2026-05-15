/**
 * 🔧 RECOVERY ENGINE (A3.11)
 */

function recoverSystem(failureReport) {
  const actions = [];

  if (failureReport.routeFailures > 5) {
    actions.push("RESET_ROUTER_CACHE");
  }

  if (failureReport.missingExec) {
    actions.push("RESTART_EXECUTION_PIPELINE");
  }

  if (failureReport.severity === "CRITICAL") {
    actions.push("FULL_KERNEL_RESTART");
  }

  return {
    timestamp: Date.now(),
    actions,
    mode:
      actions.includes("FULL_KERNEL_RESTART")
        ? "AGGRESSIVE"
        : "SAFE"
  };
}

module.exports = { recoverSystem };
