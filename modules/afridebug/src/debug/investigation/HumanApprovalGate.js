const approvals = new Map();

const HumanApprovalGate = {

  request(input = {}) {

    const id =
      input.investigationId ||
      `APPROVAL-${Date.now()}`;

    const record = {
      id,
      investigationId: input.investigationId || null,
      patchId: input.patchId || null,
      status: "PENDING",
      requestedAt: Date.now()
    };

    approvals.set(id, record);

    return record;
  },


  approve(id, reviewer = "human") {

    const record = approvals.get(id);

    if (!record) {
      return {
        approved:false,
        status:"NOT_FOUND"
      };
    }

    record.status = "APPROVED";
    record.reviewer = reviewer;
    record.approvedAt = Date.now();

    return record;
  },


  reject(id, reviewer = "human") {

    const record = approvals.get(id);

    if (!record) {
      return {
        approved:false,
        status:"NOT_FOUND"
      };
    }

    record.status = "REJECTED";
    record.reviewer = reviewer;
    record.rejectedAt = Date.now();

    return record;
  },


  canDeliver(id) {

    const record = approvals.get(id);

    return {
      allowed: record?.status === "APPROVED",
      status: record?.status || "UNKNOWN"
    };

  },


  health() {

    return {
      service:"HumanApprovalGate",
      pending:[...approvals.values()]
        .filter(a=>a.status==="PENDING").length,
      status:"healthy"
    };

  }

};


export default HumanApprovalGate;
