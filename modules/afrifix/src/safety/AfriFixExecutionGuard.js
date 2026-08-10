export class AfriFixExecutionGuard {
  check(request = {}) {
    const allowed = request.executionAllowed === true && request.executionReady === true;
    return {
      component: "AfriFix Execution Guard",
      status: allowed ? "ALLOWED" : "BLOCKED",
      executionAllowed: allowed,
      reason: allowed ? "Explicit execution permission confirmed." : "Execution remains blocked until executionReady and executionAllowed are both true.",
      checkedAt: new Date().toISOString()
    };
  }
}
