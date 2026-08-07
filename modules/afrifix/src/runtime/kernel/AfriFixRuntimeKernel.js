import { AfriFixRuntimeMiddleware } from "../middleware/AfriFixRuntimeMiddleware.js";
import { AfriFixRuntimeRouter } from "../router/AfriFixRuntimeRouter.js";

export class AfriFixRuntimeKernel {
  constructor() {
    this.middleware = new AfriFixRuntimeMiddleware();
    this.router = new AfriFixRuntimeRouter();
  }

  execute(request = {}) {
    const processed = this.middleware.process(request);

    return {
      component: "AfriFix Runtime Kernel",
      status: "READY",
      architecture: "Global Reusable Execution Capability",
      workflow: "Preview -> Approve -> Execute -> Verify -> Evidence",
      middleware: processed,
      execution: this.router.route(processed.request),
      executedAt: new Date().toISOString()
    };
  }
}
