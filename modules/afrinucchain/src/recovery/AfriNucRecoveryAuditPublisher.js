import { AfriNucRecoveryAuditPersistence } from "./AfriNucRecoveryAuditPersistence.js";

export class AfriNucRecoveryAuditPublisher {

  constructor(){
    this.component = "AfriNuc Recovery Audit Publisher";
    this.persistence = new AfriNucRecoveryAuditPersistence();
    this.events = [];
  }

  publish({jobId,batchId,workspaceId,status="RECOVERY_PIPELINE_COMPLETED"}){

    const event = {
      eventId:`recovery-${Date.now()}`,
      component:this.component,
      jobId,
      batchId,
      workspaceId,
      status,
      type:"RECOVERY_EXECUTION",
      createdAt:new Date().toISOString()
    };

    this.events.push(event);

    const persisted = this.persistence.save(event);

    return {
      component:this.component,
      status:"PUBLISHED_AND_PERSISTED",
      event,
      persisted,
      totalEvents:this.events.length
    };
  }

  list(){
    return this.persistence.list();
  }
}
