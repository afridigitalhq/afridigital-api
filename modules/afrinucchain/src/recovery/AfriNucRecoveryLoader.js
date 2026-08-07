import { AfriJobPersistence } from "../persistence/AfriJobPersistence.js";
import { AfriAuditPersistence } from "../persistence/AfriAuditPersistence.js";
import { AfriEvidencePersistence } from "../persistence/AfriEvidencePersistence.js";
import { AfriCertificatePersistence } from "../persistence/AfriCertificatePersistence.js";

export class AfriNucRecoveryLoader {
  constructor(){
    this.job = new AfriJobPersistence();
    this.audit = new AfriAuditPersistence();
    this.evidence = new AfriEvidencePersistence();
    this.certificate = new AfriCertificatePersistence();
  }

  recover(jobId,batchId){
    return {
      component:"AfriNuc Recovery Loader",
      status:"RECOVERED",

      job:this.job.load(jobId),

      audit:this.audit.load(jobId),

      evidence:this.evidence.load(batchId),

      certificate:this.certificate.load(batchId),

      recoveredAt:new Date().toISOString()
    };
  }
}
