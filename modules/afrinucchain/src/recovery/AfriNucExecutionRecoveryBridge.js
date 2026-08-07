import { AfriNucRecoveryLoader } from "./AfriNucRecoveryLoader.js";

export class AfriNucExecutionRecoveryBridge {

  constructor(){
    this.loader = new AfriNucRecoveryLoader();
  }

  recover(jobId,batchId="Batch-001"){

    const recovered = this.loader.recover(jobId,batchId);

    return {
      component:"AfriNuc Execution Recovery Bridge",
      status:"RECOVERED",
      jobId,
      batchId,
      recovered,
      resumeState: recovered?.job?.status || "UNKNOWN",
      recoveredAt:new Date().toISOString()
    };
  }
}
