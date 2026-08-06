const clients = [];

const AfriDebugClientStatusRuntime = {

  register(input = {}) {

    const record = {

      id:`CLIENTJOB-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      clientId:input.clientId || null,

      jobId:input.jobId || null,

      investigationId:input.investigationId || null,

      status:"INVESTIGATION_RUNNING",

      progress:{
        completed:0,
        totalStages:10,
        currentStage:"RepositoryIntake"
      },

      evidence:{
        available:false
      },

      delivery:{
        status:"PENDING"
      },

      createdAt:Date.now()
    };

    clients.push(record);

    return record;
  },


  updateProgress(id, data = {}) {

    const record = clients.find(
      x=>x.id===id
    );

    if(!record){
      return {
        success:false,
        reason:"CLIENT_JOB_NOT_FOUND"
      };
    }

    record.progress = {
      ...record.progress,
      ...data
    };

    return {
      success:true,
      record
    };
  },


  complete(id){

    const record = clients.find(
      x=>x.id===id
    );

    if(!record){
      return {
        success:false
      };
    }

    record.status="COMPLETED";
    record.delivery.status="READY";

    return {
      success:true,
      record
    };
  },


  get(id){

    return clients.find(
      x=>x.id===id
    );
  },


  stats(){

    return {
      clients:clients.length
    };
  }

};

export default AfriDebugClientStatusRuntime;
