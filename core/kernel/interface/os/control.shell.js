// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * CONTROL PLANE OS SHELL
 * Single unified entrypoint for all observability systems
 */

class ControlPlaneOSShell {
  constructor({ cockpit, correlator, autopsy, ws }) {
    this.cockpit = cockpit;
    this.correlator = correlator;
    this.autopsy = autopsy;
    this.ws = ws;
  }

  boot() {
    return {
      shell: this.renderShell(),
      status: "ONLINE",
      mode: "READ_ONLY_CONTROL_PLANE"
    };
  }

  renderShell() {
    return {
      live: this.cockpit?.render?.()?.live || {},
      history: this.cockpit?.render?.()?.history || [],
      predictions: this.cockpit?.render?.()?.predictions || {},
      safety: this.cockpit?.render?.()?.safety || {},

      causality: this.correlator?.correlate?.() || {},
      forensic: this.autopsy?.reconstruct?.() || {}
    };
  }
}

module.exports = { ControlPlaneOSShell };
