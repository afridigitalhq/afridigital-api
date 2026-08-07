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

    const execution = this.executor.execute(request);

    return {
      component: "AfriFix Runtime Admission Controller",
      status: "ADMITTED",
      authorization,
      execution,
      admittedAt: new Date().toISOString()
    };
  }
}
