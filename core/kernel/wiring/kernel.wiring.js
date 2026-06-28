// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

const { createKernel } = require("../bootstrap/syscall.boot");
const { CleanControlPlane } = require("../control-plane/dashboard/CleanControlPlane");

/**
 * SAFE WIRING LAYER
 * Deterministic connections only.
 * No interception, no mutation, no global overrides.
 */

function wireKernel({ core, telemetry, ledger, replay }) {
  const kernel = createKernel(core);

  const controlPlane = new CleanControlPlane({
    telemetry,
    ledger,
    replay
  });

  return {
    // EXECUTION PATH (ONLY ONE)
    dispatch: (event) => kernel.dispatch(event),

    // READ PATH (CONTROL PLANE)
    control: {
      snapshot: () => controlPlane.getSystemSnapshot(),
      timeline: () => controlPlane.getTimeline(),
      diagnostics: () => controlPlane.getDiagnostics()
    }
  };
}

module.exports = { wireKernel };
