// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * FAULT ISOLATION OVERLAY HUD
 * Visual circuit breaker + system health zoning
 */

class FaultOverlayHUD {
  constructor({ faultController }) {
    this.fault = faultController;
  }

  render() {
    return {
      zones: this._zones(),
      breakers: this._breakers(),
      isolation: this._isolationState()
    };
  }

  _zones() {
    return this.fault?.zones?.() || [];
  }

  _breakers() {
    return this.fault?.circuits?.() || [];
  }

  _isolationState() {
    return this.fault?.isolation?.() || "stable";
  }
}

module.exports = { FaultOverlayHUD };
