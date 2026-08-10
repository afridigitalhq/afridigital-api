import CoreApprovalContract from "../../../../core/approval/CoreApprovalContract.js";

export class AfriFixExecutionPolicy {
  evaluate(request = {}) {
    const approval = CoreApprovalContract.isApproved(request.approvalContext || {});
    const execution = request.executionAllowed === true && request.executionReady === true;
    return {
      component: "AfriFix Execution Policy",
      status: approval && execution ? "APPROVED" : "DENIED",
      approvalConfirmed: approval,
      executionPermissionConfirmed: execution,
      evaluatedAt: new Date().toISOString()
    };
  }
}
