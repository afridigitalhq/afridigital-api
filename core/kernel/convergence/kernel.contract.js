// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
/**
 * KERNEL CONVERGENCE CONTRACT v1
 * - No new engines allowed
 * - All systems must register as adapters
 * - All execution flows through kernel spine only
 */

const ADAPTERS = new Set([
  "whatsapp",
  "github",
  "ci",
  "hud"
]);

function assertAdapter(name) {
  if (!ADAPTERS.has(name)) {
    throw new Error("ADAPTER_NOT_REGISTERED: " + name);
  }
}

function routeThroughKernel(event) {
  if (!event || !event.type) {
    throw new Error("INVALID_EVENT");
  }

  return {
    status: "ROUTED",
    kernel: "SPINE_V1",
    event
  };
}

module.exports = {
  ADAPTERS,
  assertAdapter,
  routeThroughKernel
};
