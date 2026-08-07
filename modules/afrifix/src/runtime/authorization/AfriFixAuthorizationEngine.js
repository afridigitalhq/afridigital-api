import { AfriFixPolicyEngine } from "../policy/AfriFixPolicyEngine.js";

export class AfriFixAuthorizationEngine {
  constructor() {
    this.policy = new AfriFixPolicyEngine();
  }

  authorize(request = {}) {
    const evaluation = this.policy.evaluate(request);

    return {
      component: "AfriFix Authorization Engine",
      status: evaluation.status === "APPROVED" ? "AUTHORIZED" : "DENIED",
      request,
      policy: evaluation,
      authorizedAt: new Date().toISOString()
    };
  }
}
