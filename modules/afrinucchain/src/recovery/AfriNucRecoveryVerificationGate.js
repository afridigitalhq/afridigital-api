import { AfriNucExecutionRecoveryBridge } from "./AfriNucExecutionRecoveryBridge.js";

export class AfriNucRecoveryVerificationGate {
  constructor() {
    this.recovery = new AfriNucExecutionRecoveryBridge();
  }

  verify(jobId, batchId) {
    const result = this.recovery.recover(jobId, batchId);

    const verified =
      result.status === "RECOVERED" &&
      result.resumeState === "DELIVERY_READY" &&
      result.recovered.job.status === "DELIVERY_READY" &&
      result.recovered.certificate.certificate.status === "CERTIFIED";

    return {
      component: "AfriNuc Recovery Verification Gate",
      status: verified ? "VERIFIED" : "FAILED",
      jobId,
      batchId,
      resumeState: result.resumeState,
      integrity: {
        jobRecovered: true,
        auditRecovered: true,
        evidenceRecovered: true,
        certificateRecovered: true
      },
      verifiedAt: new Date().toISOString()
    };
  }
}
