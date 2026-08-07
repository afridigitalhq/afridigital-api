import fs from "fs";

export class AfriSuper3DemoRunner {
  constructor() {
    this.component = "AfriSuper3 Demo Runner";
  }

  run() {
    const job = JSON.parse(
      fs.readFileSync("modules/afrisuper3-demo/workspace/job.json")
    );

    const debug = JSON.parse(
      fs.readFileSync("modules/afrisuper3-demo/debug/investigation-report.json")
    );

    const fix = JSON.parse(
      fs.readFileSync("modules/afrisuper3-demo/fix/patch-plan.json")
    );

    const delivery = JSON.parse(
      fs.readFileSync("modules/afrisuper3-demo/delivery/client-report.json")
    );

    return {
      component: this.component,
      status: "COMPLETED",
      jobId: job.jobId,
      pipeline: job.pipeline,
      stages: {
        AfriDebug: debug.stage,
        AfriFix: fix.stage,
        AfriNucChain: delivery.results.execution
      },
      verification: delivery.results.verification,
      clientReady: delivery.readyForClientDelivery
    };
  }
}
