// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class DashboardBridge {
  constructor({ api, control }) {
    this.api = api;
    this.control = control;
  }

  renderSnapshot() {
    return {
      system: this.api.querySystem(),
      health: this.control.getLiveHealth(),
      forecast: this.control.getForecast()
    };
  }

  renderReplay(eventId) {
    return this.api.getReplay(eventId);
  }
}

module.exports = { DashboardBridge };
