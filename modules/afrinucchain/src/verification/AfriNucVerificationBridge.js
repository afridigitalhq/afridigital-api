import { AfriNucJobLifecycleController } from "../jobs/AfriNucJobLifecycleController.js";

export class AfriNucVerificationBridge {
  constructor(){
    this.lifecycle = new AfriNucJobLifecycleController();
  }

  verify(job){
    const transition = this.lifecycle.transition(
      {
        jobId: job.jobId,
        status: "VERIFYING"
      },
      "EVIDENCE_READY"
    );

    return {
      component:"AfriNuc Verification Bridge",
      status:"VERIFIED",
      jobId:job.jobId,
      transition,
      verifiedAt:new Date().toISOString()
    };
  }
}
