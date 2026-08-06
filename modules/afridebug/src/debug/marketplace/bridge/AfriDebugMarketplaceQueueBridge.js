import Queue from "../../queue/AfriDebugQueue.js";

const AfriDebugMarketplaceQueueBridge = {

  submit(activation = {}) {

    const queued = Queue.enqueue({

      project:activation.jobId,

      investigationId:
        activation.investigationId,

      paymentId:
        activation.paymentId,

      source:"MARKETPLACE",

      priority:"HIGH"
    });

    return {
      success:true,
      queue:queued
    };
  },


  health(){

    return {
      service:"AfriDebugMarketplaceQueueBridge",
      status:"healthy"
    };
  }

};

export default AfriDebugMarketplaceQueueBridge;
