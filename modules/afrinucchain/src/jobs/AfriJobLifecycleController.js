import { AfriJobStateManager } from "./AfriJobStateManager.js";
import { AfriJobAuditTrail } from "../audit/AfriJobAuditTrail.js";

export class AfriJobLifecycleController {

  constructor(){
    this.stateManager=new AfriJobStateManager();
    this.audit=new AfriJobAuditTrail();
  }

  update(job,state){

    const transition=this.stateManager.transition(job,state);

    if(transition.status==="UPDATED"){
      this.audit.record(
        job.jobId,
        state
      );
    }

    return {
      component:"AfriNuc Job Lifecycle Controller",
      transition,
      history:this.audit.history(job.jobId)
    };
  }

}
