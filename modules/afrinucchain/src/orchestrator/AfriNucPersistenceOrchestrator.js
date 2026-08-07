import { AfriJobPersistence } from "../persistence/AfriJobPersistence.js";
import { AfriAuditPersistence } from "../persistence/AfriAuditPersistence.js";
import { AfriEvidencePersistence } from "../persistence/AfriEvidencePersistence.js";
import { AfriCertificatePersistence } from "../persistence/AfriCertificatePersistence.js";

export class AfriNucPersistenceOrchestrator {
  constructor(){
    this.job = new AfriJobPersistence();
    this.audit = new AfriAuditPersistence();
    this.evidence = new AfriEvidencePersistence();
    this.certificate = new AfriCertificatePersistence();
  }

  persist(payload){
    return {
      component:"AfriNuc Persistence Orchestrator",
      status:"PERSISTED",

      job:this.job.save(payload.job),

      audit:this.audit.save(
        payload.job.jobId,
        payload.audit
      ),

      evidence:this.evidence.save(
        payload.batchId,
        payload.evidence
      ),

      certificate:this.certificate.save(
        payload.batchId,
        payload.certificate
      ),

      completedAt:new Date().toISOString()
    };
  }
}
