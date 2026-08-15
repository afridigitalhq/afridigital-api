import { AfriFixRuntimeAdmissionController } from "../admission/AfriFixRuntimeAdmissionController.js";

export class AfriFixRuntimeServiceGateway {
  constructor() {
    this.admission = new AfriFixRuntimeAdmissionController();
  }

  execute(request = {}) {
    const runtime = this.admission.admit(request);
    return {
      component: "AfriFix Runtime Service Gateway",
      status: runtime.status === "ADMITTED" ? "EXECUTED" : "REJECTED",
      request,
      runtime,
      completedAt: new Date().toISOString()
    };
  }

  repair(request = {}) {
    return this.execute({ ...request, action: "repair" });
  }

  verify(request = {}) {
    return this.execute({ ...request, action: "verify" });
  }

  certify(request = {}) {
    return this.execute({ ...request, action: "certify" });
  }
}
