// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class IsolationZone {
  constructor() {
    this.quarantine = new Set();
  }

  isolate(kernelName) {
    this.quarantine.add(kernelName);
    return { status: "QUARANTINED", kernel: kernelName };
  }

  release(kernelName) {
    this.quarantine.delete(kernelName);
    return { status: "RELEASED", kernel: kernelName };
  }

  isIsolated(kernelName) {
    return this.quarantine.has(kernelName);
  }
}

module.exports = { IsolationZone };
