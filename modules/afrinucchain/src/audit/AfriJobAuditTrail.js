export class AfriJobAuditTrail {

  constructor(){
    this.events=[];
  }

  record(jobId,state){

    const event={
      jobId,
      state,
      timestamp:new Date().toISOString()
    };

    this.events.push(event);

    return {
      component:"AfriNuc Job Audit Trail",
      status:"RECORDED",
      event
    };
  }

  history(jobId){

    return {
      component:"AfriNuc Job Audit Trail",
      jobId,
      events:this.events.filter(
        e=>e.jobId===jobId
      )
    };
  }

}
