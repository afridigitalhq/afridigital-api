import { AfriNucJobLifecycleController } from "../jobs/AfriNucJobLifecycleController.js";

export class AfriNucLifecycleOrchestrator {
  constructor(){
    this.lifecycle = new AfriNucJobLifecycleController();
  }

  run(job){
    const states = [
      "INVESTIGATING",
      "PLANNED",
      "APPROVED",
      "EXECUTING",
      "VERIFYING",
      "EVIDENCE_READY",
      "CERTIFIED",
      "DELIVERY_READY"
    ];

    const events = [];

    let current = job;

    for(const state of states){
      const result = this.lifecycle.transition(
        {
          jobId:job.jobId,
          status:current.status || job.status
        },
        state
      );

      events.push(result);

      if(result.transition?.currentState){
        current.status = result.transition.currentState;
      }
    }

    return {
      component:"AfriNuc Lifecycle Orchestrator",
      status:"COMPLETED",
      jobId:job.jobId,
      finalState:current.status,
      events,
      completedAt:new Date().toISOString()
    };
  }
}
