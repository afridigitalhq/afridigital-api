import fs from "fs";
import path from "path";

export class AfriNucExecutionAuditVerificationBridge {

  constructor(){

    this.component="AfriNuc Execution Audit Verification Bridge";
    this.base="modules/afrinucchain/.data/execution-audit-verification";

    fs.mkdirSync(this.base,{recursive:true});

  }

  verify({executionId,telemetryId,evidenceId,jobId}){

    const executionExists=Boolean(executionId);
    const telemetryLinked=Boolean(telemetryId);
    const evidenceLinked=Boolean(evidenceId);
    const jobLinked=Boolean(jobId);

    const evidenceFile=path.resolve(
      "modules/afrinucchain/.data/execution-evidence",
      `${evidenceId || "missing"}.json`
    );

    const evidenceExists=evidenceLinked && fs.existsSync(evidenceFile);

    const integrity={
      executionExists,
      telemetryLinked,
      evidenceLinked,
      evidenceExists,
      jobLinked
    };

    const verified=Object.values(integrity).every(Boolean);

    const verification={
      verificationId:`verification-${Date.now()}`,
      component:this.component,
      executionId,
      telemetryId,
      evidenceId,
      jobId,
      integrity,
      status:verified ? "VERIFIED" : "FAILED",
      reason:verified ? null : "EXECUTION_AUDIT_INTEGRITY_FAILED",
      verifiedAt:new Date().toISOString()
    };

    const file=path.join(
      this.base,
      `${verification.verificationId}.json`
    );

    fs.writeFileSync(
      file,
      JSON.stringify(verification,null,2)
    );

    return {
      component:this.component,
      status:verification.status,
      verification,
      file
    };

  }
}
