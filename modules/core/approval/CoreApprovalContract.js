const APPROVAL_STATUS = Object.freeze({
  REQUESTED: "REQUESTED",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
});

const CoreApprovalContract = {

  name: "Core Human Approval Contract",
  version: "1.0.0",

  statuses: APPROVAL_STATUS,

  request(input = {}) {
    return {
      id: input.id || `APR-${Date.now()}`,
      source: input.source || "unknown",
      subjectType: input.subjectType || "repair",
      subjectId: input.subjectId || null,
      investigationId: input.investigationId || null,
      patchId: input.patchId || null,
      status: APPROVAL_STATUS.PENDING,
      approvalRequired: true,
      requestedAt: new Date().toISOString()
    };
  },

  approve(record = {}, reviewer = "human") {
    return {
      ...record,
      status: APPROVAL_STATUS.APPROVED,
      approved: true,
      reviewer,
      approvedAt: new Date().toISOString()
    };
  },

  reject(record = {}, reviewer = "human") {
    return {
      ...record,
      status: APPROVAL_STATUS.REJECTED,
      approved: false,
      reviewer,
      rejectedAt: new Date().toISOString()
    };
  },

  isApproved(record = {}) {
    return record.status === APPROVAL_STATUS.APPROVED &&
      record.approved === true;
  },

  canExecute(record = {}) {
    return this.isApproved(record);
  }

};

export { APPROVAL_STATUS };
export default CoreApprovalContract;
