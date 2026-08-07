export class AfriNucJobRegistry {
  constructor(){
    this.jobs=[];
  }

  register(job){
    const record={
      registryId:`registry-${Date.now()}`,
      jobId:job.jobId,
      workspace:job.workspace,
      project:job.project,
      status:job.status || "CREATED",
      registeredAt:new Date().toISOString()
    };

    this.jobs.push(record);

    return {
      component:"AfriNuc Job Registry",
      status:"REGISTERED",
      record
    };
  }

  list(){
    return {
      component:"AfriNuc Job Registry",
      total:this.jobs.length,
      jobs:this.jobs
    };
  }
}
