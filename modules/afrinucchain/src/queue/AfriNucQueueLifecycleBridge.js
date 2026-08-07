import { AfriNucJobLifecycleController } from "../jobs/AfriNucJobLifecycleController.js";

export class AfriNucQueueLifecycleBridge {
  constructor(){
    this.lifecycle = new AfriNucJobLifecycleController();
  }

  complete(queueItem){
    const job = {
      jobId: queueItem.jobId,
      status: "EXECUTING"
    };

    const transition = this.lifecycle.transition(
      job,
      "VERIFYING"
    );

    return {
      component:"AfriNuc Queue Lifecycle Bridge",
      status:"UPDATED",
      queueId:queueItem.queueId,
      jobId:queueItem.jobId,
      transition
    };
  }
}
