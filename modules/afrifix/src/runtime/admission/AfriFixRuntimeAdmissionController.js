import { AfriFixAuthorizationEngine } from "../authorization/AfriFixAuthorizationEngine.js";
import { AfriFixExecutionExecutor } from "../executor/AfriFixExecutionExecutor.js";

export class AfriFixRuntimeAdmissionController {
  constructor() {
    this.authorization = new AfriFixAuthorizationEngine();
    this.executor = new AfriFixExecutionExecutor();
  }

  admit(request = {}) {
    const authorization = this.authorization.authorize(request);

    if (authorization.status !== "AUTHORIZED") {
      return {
        component: "AfriFix Runtime Admission Controller",
        status: "REJECTED",
        authorization,
        timestamp: new Date().toISOString()
      };
    }

    const executionRequest = {
      ...request,
      executionReady: true,
      executionAllowed: true
    };

    const execution = this.executor.execute(executionRequest);

    return {
      component: "AfriFix Runtime Admission Controller",
      status: execution.status === "EXECUTED" ? "ADMITTED" : "REJECTED",
      authorization,
      execution,
      ...(execution.status === "EXECUTED"
        ? { admittedAt: new Date().toISOString() }
        : { rejectedAt: new Date().toISOString() })
    };
  }
}
