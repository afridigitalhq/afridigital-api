import { AfriJobStateManager } from "./AfriJobStateManager.js";
import { AfriJobAuditTrail } from "../audit/AfriJobAuditTrail.js";

export class AfriNucJobLifecycleController {
  constructor(){
    this.stateManager = new AfriJobStateManager();
    this.audit = new AfriJobAuditTrail();
  }

  transition(job,newState){
    const result = this.stateManager.transition(job,newState);

    this.audit.record(
      job.jobId,
      newState
    );

    return {
      component:"AfriNuc Job Lifecycle Controller",
      transition:result,
      history:this.audit.history(job.jobId)
    };
  }
}
