// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const KernelContract = {
  version: "v1",
  mode: "event-sourced",

  rules: {
    execution: "kernel-only",
    state: "derived-only",
    mutation: "forbidden_outside_kernel",
    adapters: "whatsapp|github|ci|render",
    governance: "read-only + quorum-gated decisions"
  },

  topology: {
    spine: "event-ledger",
    gate: "governance-router",
    ui: "dashboard-hud",
    adapters: "external-integrations"
  }
};

module.exports = { KernelContract };
