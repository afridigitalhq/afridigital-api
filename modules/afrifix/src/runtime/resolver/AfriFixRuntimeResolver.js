import { AfriFixGlobalRuntimeRegistry } from "../global/AfriFixGlobalRuntimeRegistry.js";

export class AfriFixRuntimeResolver {
  constructor() {
    this.registry = new AfriFixGlobalRuntimeRegistry();
  }

  resolve(request = {}) {
    const pipeline = this.registry.resolve(request.module);

    return {
      component: "AfriFix Runtime Resolver",
      status: pipeline ? "RESOLVED" : "NOT_FOUND",
      module: request.module,
      action: request.action || "unknown",
      pipeline,
      resolvedAt: new Date().toISOString()
    };
  }
}
