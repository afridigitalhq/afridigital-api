/**
 * TEST ONLY. Process-local storage is not suitable for production approval records.
 */
export class AfriAgentApprovalMemoryRepository {
  constructor() {
    this.records = new Map();
  }

  async create(record) {
    if (this.records.has(record.approvalId)) throw new Error("AFRI_APPROVAL_DUPLICATE_ID");
    this.records.set(record.approvalId, structuredClone(record));
    return structuredClone(record);
  }

  async get(id) {
    const record = this.records.get(id);
    return record ? structuredClone(record) : null;
  }

  async approvePending(id, patch) {
    const record = this.records.get(id);
    if (!record || record.status !== "PENDING") return null;
    Object.assign(record, structuredClone(patch), { status: "APPROVED" });
    return structuredClone(record);
  }

  async rejectPending(id, patch) {
    const record = this.records.get(id);
    if (!record || record.status !== "PENDING") return null;
    Object.assign(record, structuredClone(patch), { status: "REJECTED" });
    return structuredClone(record);
  }

  async consumeApproved({ approvalId, sourceAgentId, requesterId, planFingerprint, consumedAt }) {
    const record = this.records.get(approvalId);

    if (
      !record ||
      record.status !== "APPROVED" ||
      record.sourceAgentId !== sourceAgentId ||
      record.requestedBy !== requesterId ||
      record.planFingerprint !== planFingerprint ||
      record.expiresAt <= consumedAt ||
      record.consumedAt !== null
    ) return null;

    Object.assign(record, { status: "CONSUMED", consumedAt });
    return structuredClone(record);
  }
}

export default AfriAgentApprovalMemoryRepository;
