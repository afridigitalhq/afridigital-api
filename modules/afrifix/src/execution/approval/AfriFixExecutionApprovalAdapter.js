import CoreApprovalContract from "../../../../core/approval/CoreApprovalContract.js";

const AfriFixExecutionApprovalAdapter = {

  request(input = {}) {
    return CoreApprovalContract.request({
      source: "AfriFix",
      subjectType: "repair",
      subjectId: input.repairId || input.patchId || null,
      investigationId: input.investigationId || null,
      patchId: input.patchId || null
    });
  },

  approve(record = {}, reviewer = "human") {
    return CoreApprovalContract.approve(record, reviewer);
  },

  reject(record = {}, reviewer = "human") {
    return CoreApprovalContract.reject(record, reviewer);
  },

  isApproved(record = {}) {
    return CoreApprovalContract.isApproved(record);
  },

  canExecute(record = {}) {
    return CoreApprovalContract.canExecute(record);
  }

};

export default AfriFixExecutionApprovalAdapter;
