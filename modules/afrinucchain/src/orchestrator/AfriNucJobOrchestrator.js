import { AfriNucJobLifecycleController } from "../jobs/AfriNucJobLifecycleController.js";

export class AfriNucJobOrchestrator {
  constructor(){
    this.lifecycle = new AfriNucJobLifecycleController();
  }

  async run(job){
    const states=[
      "INVESTIGATING",
      "PLANNED",
      "APPROVED",
      "EXECUTING",
      "VERIFYING",
      "EVIDENCE_READY",
      "CERTIFIED",
      "DELIVERY_READY"
    ];

    const events=[];

    let current={
      jobId:job.jobId,
      status:"CREATED"
    };

    for(const state of states){
      const result=this.lifecycle.transition(current,state);
      current={
        jobId:job.jobId,
        status:state
      };
      events.push(result);
    }

    return {
      component:"AfriNuc Job Orchestrator",
      status:"COMPLETED",
      jobId:job.jobId,
      events,
      completedAt:new Date().toISOString()
    };
  }
}
