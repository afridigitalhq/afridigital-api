import Scheduler from "../../scheduler/AfriDebugJobScheduler.js";

const AfriDebugMarketplaceSchedulerBridge = {

  dispatch(queueItem = {}) {

    const result = Scheduler.runNext({
      source:"MARKETPLACE",
      jobId:queueItem.project,
      investigationId:queueItem.investigationId,
      paymentId:queueItem.paymentId
    });

    return {
      success:true,
      source:"MARKETPLACE",
      scheduler:result
    };
  },


  health(){

    return {
      service:"AfriDebugMarketplaceSchedulerBridge",
      status:"healthy"
    };
  }

};

export default AfriDebugMarketplaceSchedulerBridge;
