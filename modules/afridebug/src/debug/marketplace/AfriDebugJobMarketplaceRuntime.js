const jobs = [];

const AfriDebugJobMarketplaceRuntime = {

  create(input = {}) {

    const job = {
      id:`JOB-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      source:input.source || "DIRECT",

      client:{
        id:input.clientId || null,
        name:input.clientName || null
      },

      project:input.project || null,

      category:input.category || "GENERAL_DEBUG",

      description:input.description || null,

      budget:{
        currency:input.currency || "AfriCoin",
        amount:input.amount || null
      },

      status:"NEW",

      createdAt:Date.now()
    };

    jobs.push(job);

    return job;
  },


  assign(jobId, developerId){

    const job = jobs.find(
      x=>x.id===jobId
    );

    if(!job){
      return {
        success:false,
        reason:"JOB_NOT_FOUND"
      };
    }

    job.developerId = developerId;
    job.status = "ASSIGNED";

    return {
      success:true,
      job
    };
  },


  list(){
    return jobs;
  },


  stats(){

    return {
      jobs:jobs.length,
      new:jobs.filter(
        x=>x.status==="NEW"
      ).length
    };
  }

};

export default AfriDebugJobMarketplaceRuntime;
