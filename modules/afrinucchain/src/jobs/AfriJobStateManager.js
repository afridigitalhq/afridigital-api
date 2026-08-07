export class AfriJobStateManager {
  constructor(){
    this.transitions={
      CREATED:["INVESTIGATING"],
      INVESTIGATING:["PLANNED"],
      PLANNED:["APPROVED"],
      APPROVED:["EXECUTING"],
      EXECUTING:["VERIFYING"],
      VERIFYING:["EVIDENCE_READY"],
      EVIDENCE_READY:["CERTIFIED"],
      CERTIFIED:["DELIVERY_READY"],
      DELIVERY_READY:[]
    };
  }

  transition(job,newState){
    const allowed=this.transitions[job.status]||[];

    if(!allowed.includes(newState)){
      return {
        component:"AfriNuc Job State Manager",
        status:"REJECTED",
        reason:"Invalid State",
        currentState:job.status,
        requestedState:newState
      };
    }

    return {
      component:"AfriNuc Job State Manager",
      status:"UPDATED",
      jobId:job.jobId,
      previousState:job.status,
      currentState:newState,
      updatedAt:new Date().toISOString()
    };
  }
}
