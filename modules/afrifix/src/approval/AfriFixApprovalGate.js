import CoreApprovalContract from "../../../core/approval/CoreApprovalContract.js";

export class AfriFixApprovalGate {
  evaluate(request = {}) {
    const context = request.approvalContext || {};
    const approved = CoreApprovalContract.isApproved(context);
    return {
      component: "AfriFix Approval Gate",
      status: approved ? "APPROVED" : "BLOCKED",
      approved,
      reason: approved ? "Human approval confirmed." : "Human approval required before repair execution.",
      evaluatedAt: new Date().toISOString()
    };
  }
}
