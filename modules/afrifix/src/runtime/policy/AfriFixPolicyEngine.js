import { AfriFixApprovalGate } from "../../approval/AfriFixApprovalGate.js";
import { AfriFixExecutionGuard } from "../../safety/AfriFixExecutionGuard.js";

export class AfriFixPolicyEngine {
  constructor(){
    this.approval = new AfriFixApprovalGate();
    this.guard = new AfriFixExecutionGuard();
  }

  evaluate(request = {}) {
    const approval = this.approval.evaluate(request);
    const guard = this.guard.check(request);
    const policy = {
      approvalRequired: request.approvalRequired ?? true,
      evidenceRequired: request.evidenceRequired ?? true,
      workspaceRequired: !!request.workspace,
      approvalConfirmed: approval.approved,
      executionPermissionConfirmed: guard.executionAllowed,
      allowed: !!request.module && !!request.action && approval.approved
    };
    return {
      component: "AfriFix Policy Engine",
      status: policy.allowed ? "APPROVED" : "DENIED",
      policy,
      approval,
      guard,
      request,
      evaluatedAt: new Date().toISOString()
    };
  }
}
