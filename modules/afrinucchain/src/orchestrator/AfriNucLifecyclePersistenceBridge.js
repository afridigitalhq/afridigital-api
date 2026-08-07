import { AfriNucLifecycleOrchestrator } from "./AfriNucLifecycleOrchestrator.js";
import { AfriNucPersistenceOrchestrator } from "../persistence/AfriNucPersistenceOrchestrator.js";

export class AfriNucLifecyclePersistenceBridge {
  constructor(){
    this.lifecycle = new AfriNucLifecycleOrchestrator();
    this.persistence = new AfriNucPersistenceOrchestrator();
  }

  run(job,batchId="Batch-001"){
    const lifecycle = this.lifecycle.run(job);

    const persisted = this.persistence.persist({
      job:{
        jobId:job.jobId,
        status:lifecycle.finalState
      },
      audit:lifecycle.events.map(e=>({
        state:e.transition.currentState
      })),
      batchId,
      evidence:{
        status:"GENERATED"
      },
      certificate:{
        status:"CERTIFIED"
      }
    });

    return {
      component:"AfriNuc Lifecycle Persistence Bridge",
      status:"COMPLETED_AND_PERSISTED",
      lifecycle,
      persisted,
      completedAt:new Date().toISOString()
    };
  }
}
