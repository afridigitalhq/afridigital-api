// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class KernelOrchestrator {
  constructor({ kernels = {}, policyEngine }) {
    this.kernels = kernels;
    this.policy = policyEngine;
    this.topology = new Map();
  }

  registerKernel(name, kernel) {
    this.kernels[name] = kernel;
    this.topology.set(name, {
      status: "ACTIVE",
      lastSync: Date.now()
    });
  }

  // Route event to correct kernel(s)
  route(event) {
    const targets = this._resolveTargets(event);

    return targets.map(t => {
      const kernel = this.kernels[t];

      if (!kernel) {
        return { ok: false, target: t, reason: "KERNEL_NOT_FOUND" };
      }

      return {
        target: t,
        result: kernel.dispatch
          ? kernel.dispatch(event)
          : kernel.ingest?.(event)
      };
    });
  }

  // Compare state across kernels (read-only)
  compareStates(query) {
    const snapshots = Object.entries(this.kernels).map(
      ([name, kernel]) => ({
        kernel: name,
        state: kernel.getControlPlane
          ? kernel.getControlPlane()
          : null
      })
    );

    return {
      snapshots,
      divergenceScore: this._calculateDivergence(snapshots)
    };
  }

  // Simple policy-based routing logic
  _resolveTargets(event) {
    if (event.type?.includes("simulation")) {
      return ["simulation"];
    }

    if (event.type?.includes("replay")) {
      return ["replay"];
    }

    if (event.type?.includes("telemetry")) {
      return ["telemetry"];
    }

    // default: syscall kernel
    return ["syscall"];
  }

  _calculateDivergence(snapshots) {
    return snapshots.length; // placeholder metric (can evolve later)
  }
}

module.exports = { KernelOrchestrator };
