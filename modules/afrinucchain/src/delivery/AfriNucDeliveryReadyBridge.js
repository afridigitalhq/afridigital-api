import { AfriNucJobLifecycleController } from "../jobs/AfriNucJobLifecycleController.js";

export class AfriNucDeliveryReadyBridge {
  constructor(){
    this.lifecycle = new AfriNucJobLifecycleController();
  }

  prepare(job){
    const transition = this.lifecycle.transition(
      job,
      "DELIVERY_READY"
    );

    return {
      component:"AfriNuc Delivery Ready Bridge",
      status:"READY_FOR_DELIVERY",
      jobId:job.jobId,
      transition,
      readyAt:new Date().toISOString()
    };
  }
}
