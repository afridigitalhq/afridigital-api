import crypto from "crypto";

export class ChainOfCustody {
  constructor() {
    this.records = new Map();
  }

  generateHash(data) {
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");
  }

  sealEvidence(evidence) {
    const timestamp = Date.now();

    const record = {
      id: evidence.id,
      hash: this.generateHash(evidence),
      timestamp,
      type: evidence.type || "UNKNOWN",
      source: evidence.cameraId || null,
      integrity: "SEALED"
    };

    this.records.set(record.id, record);

    return record;
  }

  verifyEvidence(id, evidence) {
    const record = this.records.get(id);
    if (!record) return false;

    const currentHash = this.generateHash(evidence);

    return currentHash === record.hash;
  }

  getRecord(id) {
    return this.records.get(id) || null;
  }

  getAllRecords() {
    return Array.from(this.records.values());
  }
}

export const chainOfCustody = new ChainOfCustody();
