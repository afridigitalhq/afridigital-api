// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const Kernel = require("../spine");

class KernelGateway {
  constructor() {
    this.kernel = Kernel;
  }

  route(event) {
    if (!event || typeof event !== "object") {
      return { ok: false, reason: "INVALID_EVENT_SHAPE" };
    }

    return this.kernel.ingest(event);
  }
}

module.exports = new KernelGateway();
