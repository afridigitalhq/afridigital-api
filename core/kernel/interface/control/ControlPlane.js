// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class ControlPlane {
  constructor({ ktil, kgrs }) {
    this.ktil = ktil;
    this.kgrs = kgrs;
  }

  getLiveHealth() {
    return this.ktil?.telemetry?.ingest?.() || {};
  }

  getForecast() {
    return this.ktil?.forecast?.predict?.(this.getLiveHealth());
  }

  getGlobalTimeline() {
    return this.kgrs?.TimelineBuilder?.build?.() || [];
  }
}

module.exports = { ControlPlane };
