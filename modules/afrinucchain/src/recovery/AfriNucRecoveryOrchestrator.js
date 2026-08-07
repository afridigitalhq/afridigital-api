import { AfriNucExecutionRecoveryBridge } from "./AfriNucExecutionRecoveryBridge.js";
import { AfriNucRecoveryVerificationGate } from "./AfriNucRecoveryVerificationGate.js";
import { AfriNucRecoveryCompletionController } from "./AfriNucRecoveryCompletionController.js";
import { AfriNucRecoveryStateSynchronizer } from "./AfriNucRecoveryStateSynchronizer.js";
import { AfriNucRecoveryAuditPublisher } from "./AfriNucRecoveryAuditPublisher.js";
import { AfriNucRecoveryAuditVerificationGate } from "./AfriNucRecoveryAuditVerificationGate.js";
import { AfriNucRecoveryCertificateGenerator } from "./AfriNucRecoveryCertificateGenerator.js";

export class AfriNucRecoveryOrchestrator {

  constructor(){
    this.recovery = new AfriNucExecutionRecoveryBridge();
    this.verify = new AfriNucRecoveryVerificationGate();
    this.complete = new AfriNucRecoveryCompletionController();
    this.sync = new AfriNucRecoveryStateSynchronizer();
    this.audit = new AfriNucRecoveryAuditPublisher();
    this.auditVerify = new AfriNucRecoveryAuditVerificationGate();
    this.certificate = new AfriNucRecoveryCertificateGenerator();
  }

  run({jobId,batchId,workspaceId}){

    const recovered = this.recovery.recover(jobId,batchId);
    const verified = this.verify.verify(jobId,batchId);
    const completed = this.complete.complete(jobId,batchId);
    const synchronized = this.sync.sync({workspaceId,jobId});

    const audit = this.audit.publish({
      jobId,
      batchId,
      workspaceId,
      status:"RECOVERY_PIPELINE_COMPLETED"
    });

    const auditVerified = this.auditVerify.verify(
      audit.event.eventId
    );

    const certificate = this.certificate.generate({
      jobId,
      batchId,
      workspaceId,
      auditEventId:audit.event.eventId
    });

    return {
      component:"AfriNuc Recovery Orchestrator",
      status:"RECOVERY_PIPELINE_COMPLETED",
      recovered,
      verified,
      completed,
      synchronized,
      audit,
      auditVerified,
      certificate,
      completedAt:new Date().toISOString()
    };
  }
}
