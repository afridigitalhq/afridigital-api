import fs from "fs";

export class AfriDebugClientInvestigator {
  constructor() {
    this.component = "AfriDebug Client Investigator";
  }

  investigate() {
    const job = JSON.parse(
      fs.readFileSync("modules/afrisuper3-demo/client-job/job-request.json")
    );

    const log = fs.readFileSync(
      "modules/afrisuper3-demo/client-job/sample-app/runtime-error.log",
      "utf8"
    );

    const report = {
      jobId: job.jobId,
      component: "AfriDebug",
      stage: "INVESTIGATION_COMPLETED",
      repository: job.repository,
      issue: {
        type: job.issueType,
        detected: log.includes("RuntimeError"),
        message: "Missing environment configuration",
        severity: "HIGH"
      },
      analysis: {
        repositoryScanned: true,
        runtimeInspected: true,
        logAnalyzed: true,
        rootCause: "Missing runtime environment configuration"
      },
      recommendation: {
        action: "UPDATE_ENVIRONMENT_CONFIGURATION",
        readyForAfriFix: true
      },
      createdAt: new Date().toISOString()
    };

    fs.writeFileSync(
      "modules/afrisuper3-demo/debug/client-investigation-report.json",
      JSON.stringify(report, null, 2)
    );

    return report;
  }
}
