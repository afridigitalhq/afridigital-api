export class AfriJobRegistry {

  constructor(){
    this.jobs=[];
  }

  register(job){

    const record={
      jobId:`job-${Date.now()}`,
      ...job,
      status:"CREATED",
      createdAt:new Date().toISOString()
    };

    this.jobs.push(record);

    return record;
  }

  list(){
    return {
      component:"AfriNuc Job Registry",
      total:this.jobs.length,
      jobs:this.jobs
    };
  }

}
