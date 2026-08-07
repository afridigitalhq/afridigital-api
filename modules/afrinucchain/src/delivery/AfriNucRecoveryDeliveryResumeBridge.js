import { AfriNucRecoveryCompletionController } from "../recovery/AfriNucRecoveryCompletionController.js";

export class AfriNucRecoveryDeliveryResumeBridge {

  constructor(){
    this.recovery = new AfriNucRecoveryCompletionController();
  }

  resume(jobId,batchId,workspaceId){

    const result = this.recovery.complete(jobId,batchId);

    return {
      component:"AfriNuc Recovery Delivery Resume Bridge",
      status:"RESUMED",
      workspaceId,
      jobId,
      batchId,
      deliveryState:result.state,
      handoff:result.handoff,
      resumedAt:new Date().toISOString()
    };
  }
}
