export class AfriJobStore {

  constructor(){
    this.jobs=new Map();
  }

  create(job){
    this.jobs.set(job.jobId,{
      ...job,
      history:[
        {
          state:job.status,
          timestamp:new Date().toISOString()
        }
      ]
    });

    return this.jobs.get(job.jobId);
  }


  update(jobId,state){

    const job=this.jobs.get(jobId);

    if(!job){
      return {
        status:"NOT_FOUND",
        jobId
      };
    }

    job.status=state;

    job.history.push({
      state,
      timestamp:new Date().toISOString()
    });

    return {
      status:"UPDATED",
      job
    };
  }


  get(jobId){

    return this.jobs.get(jobId);
  }

}
