import ArtifactStorage from "../storage/AfriDebugArtifactStorage.js";
import Ledger from "../audit/AfriDebugImmutableAuditLedger.js";
import CoreApprovalContract from "../../../../modules/core/approval/CoreApprovalContract.js";

const queue = [];

const AfriDebugRepairApprovalQueue = {

  submit(input = {}) {

    const approvalId = input.approvalId || `APPROVAL-${Date.now()}`;

    const request = CoreApprovalContract.request({
      id: approvalId,
      source: input.source || "AfriDebug",
      subjectType: input.subjectType || "repair",
      subjectId: input.subjectId || input.planId || null,
      investigationId: input.incidentId || input.investigationId || null,
      patchId: input.patchId || null
    });

    const record = {
      approvalId: request.id,
      planId: input.planId || null,
      incidentId: input.incidentId || input.investigationId || null,
      action: input.action || "repair",
      status: request.status,
      approvalRequired: request.approvalRequired,
      submittedAt: Date.now(),
      coreApprovalId: request.id
    };

    queue.push(record);

    ArtifactStorage.save(
      "approvals/repair-queue",
      record.approvalId,
      record
    );

    ArtifactStorage.save(
      "approvals",
      "repair-queue",
      queue
    );

    Ledger.record({
      type: "HUMAN_APPROVAL_REQUESTED",
      approvalId: record.approvalId,
      actor: "AfriDebugRepairApprovalQueue"
    });

    return record;
  },

  approve(id, reviewer = "human") {

    const request = queue.find(
      item => item.approvalId === id
    );

    if (!request) {
      return {
        success: false,
        reason: "APPROVAL_NOT_FOUND"
      };
    }

    const approved = CoreApprovalContract.approve(
      {
        ...request,
        id: request.approvalId
      },
      reviewer
    );

    Object.assign(request, {
      ...approved,
      approvalId: request.approvalId,
      coreApprovalId: request.approvalId
    });

    ArtifactStorage.save(
      "approvals/repair-queue",
      request.approvalId,
      request
    );

    ArtifactStorage.save(
      "approvals",
      "repair-queue",
      queue
    );

    Ledger.record({
      type: "HUMAN_APPROVAL_GRANTED",
      approvalId: request.approvalId,
      reviewer,
      actor: "AfriDebugRepairApprovalQueue"
    });

    return {
      success: true,
      request
    };
  },

  reject(id, reviewer = "human") {

    const request = queue.find(
      item => item.approvalId === id
    );

    if (!request) {
      return {
        success: false,
        reason: "APPROVAL_NOT_FOUND"
      };
    }

    const rejected = CoreApprovalContract.reject(
      {
        ...request,
        id: request.approvalId
      },
      reviewer
    );

    Object.assign(request, {
      ...rejected,
      approvalId: request.approvalId,
      coreApprovalId: request.approvalId
    });

    ArtifactStorage.save(
      "approvals/repair-queue",
      request.approvalId,
      request
    );

    ArtifactStorage.save(
      "approvals",
      "repair-queue",
      queue
    );

    Ledger.record({
      type: "HUMAN_APPROVAL_REJECTED",
      approvalId: request.approvalId,
      reviewer,
      actor: "AfriDebugRepairApprovalQueue"
    });

    return {
      success: true,
      request
    };
  },

  list() {
    return [...queue];
  },

  health() {
    return {
      service: "AfriDebugRepairApprovalQueue",
      persistent: true,
      auditBound: true,
      coreApprovalContract: true,
      status: "healthy"
    };
  }
};

export default AfriDebugRepairApprovalQueue;
