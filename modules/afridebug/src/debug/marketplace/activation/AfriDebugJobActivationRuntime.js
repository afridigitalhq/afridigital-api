const activations = [];

const AfriDebugJobActivationRuntime = {

  activate(input = {}) {

    const activation = {

      id:`ACT-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      jobId:input.jobId || null,

      paymentId:input.paymentId || null,

      investigationId:
        `INV-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      status:"READY",

      createdAt:Date.now()
    };

    activations.push(activation);

    return activation;
  },


  start(id){

    const activation = activations.find(
      x=>x.id===id
    );

    if(!activation){
      return {
        success:false,
        reason:"ACTIVATION_NOT_FOUND"
      };
    }

    activation.status="RUNNING";

    return {
      success:true,
      activation
    };
  },


  list(){
    return activations;
  },


  stats(){
    return {
      activations:activations.length,
      running:activations.filter(
        x=>x.status==="RUNNING"
      ).length
    };
  }

};

export default AfriDebugJobActivationRuntime;
