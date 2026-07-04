import { socRBAC } from "../security/SOCRBAC.js";
import { cameraActionGuard } from "../../cameras/guard/CameraActionGuard.js";

export class ApprovalWorkflowEngine {
  constructor() {
    this.queue = new Map();
  }

  requestApproval(userId, action) {
    const decision = cameraActionGuard.validate(userId, action);

    if (decision.allowed) {
      return {
        status: "AUTO_APPROVED",
        action
      };
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const request = {
      id,
      userId,
      action,
      status: "PENDING_APPROVAL",
      createdAt: Date.now()
    };

    this.queue.set(id, request);

    return request;
  }

  approve(approvalId, adminId) {
    if (!socRBAC.can(adminId, "EXECUTE")) {
      return { error: "NOT_AUTHORIZED" };
    }

    const request = this.queue.get(approvalId);
    if (!request) return { error: "NOT_FOUND" };

    request.status = "APPROVED";
    request.approvedBy = adminId;
    request.approvedAt = Date.now();

    return request;
  }

  reject(approvalId, adminId) {
    const request = this.queue.get(approvalId);
    if (!request) return { error: "NOT_FOUND" };

    request.status = "REJECTED";
    request.rejectedBy = adminId;
    request.rejectedAt = Date.now();

    return request;
  }

  execute(approvalId, executor) {
    const request = this.queue.get(approvalId);
    if (!request) return { error: "NOT_FOUND" };

    if (request.status !== "APPROVED") {
      return { error: "NOT_APPROVED" };
    }

    const result = executor(request.action);

    request.status = "EXECUTED";
    request.executedAt = Date.now();
    request.result = result;

    return request;
  }

  getQueue() {
    return Array.from(this.queue.values());
  }
}

export const approvalWorkflowEngine = new ApprovalWorkflowEngine();
