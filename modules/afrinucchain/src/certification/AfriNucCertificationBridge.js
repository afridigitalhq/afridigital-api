import { AfriNucJobLifecycleController } from "../jobs/AfriNucJobLifecycleController.js";

export class AfriNucCertificationBridge {
  constructor(){
    this.lifecycle = new AfriNucJobLifecycleController();
  }

  certify(job){
    const transition = this.lifecycle.transition(
      job,
      "CERTIFIED"
    );

    return {
      component:"AfriNuc Certification Bridge",
      status:"CERTIFIED",
      jobId:job.jobId,
      transition,
      certifiedAt:new Date().toISOString()
    };
  }
}
