import { AfriNucRecoveryAuditPersistence } from "./AfriNucRecoveryAuditPersistence.js";

export class AfriNucRecoveryAuditVerificationGate {

  constructor(){
    this.component = "AfriNuc Recovery Audit Verification Gate";
    this.persistence = new AfriNucRecoveryAuditPersistence();
  }

  verify(eventId){

    const event = this.persistence.load(eventId);

    const integrity = {
      eventExists: !!event,
      jobLinked: !!event.jobId,
      batchLinked: !!event.batchId,
      statusValid: event.status === "RECOVERY_PIPELINE_COMPLETED"
    };

    const verified = Object.values(integrity)
      .every(Boolean);

    return {
      component:this.component,
      status: verified ? "VERIFIED" : "FAILED",
      eventId,
      integrity,
      verifiedAt:new Date().toISOString()
    };
  }
}
