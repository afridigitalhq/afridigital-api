import { AfriFixRuntimeResolver } from "../resolver/AfriFixRuntimeResolver.js";
import { AfriFixRuntimeBus } from "../bus/AfriFixRuntimeBus.js";

export class AfriFixRuntimeRouter {
  constructor() {
    this.resolver = new AfriFixRuntimeResolver();
    this.bus = new AfriFixRuntimeBus();
  }

  route(request = {}) {
    const resolved = this.resolver.resolve(request);
    const execution = this.bus.dispatch(request);

    return {
      component: "AfriFix Runtime Router",
      status: "ROUTED",
      workflow: "Resolve -> Route -> Execute -> Verify -> Evidence",
      resolver: resolved,
      execution,
      routedAt: new Date().toISOString()
    };
  }
}
