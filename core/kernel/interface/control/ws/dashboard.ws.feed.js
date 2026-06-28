// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * LIVE CONTROL PLANE WEBSOCKET FEED
 * Read-only real-time state broadcaster
 */

class DashboardWSFeed {
  constructor({ wsServer, telemetryBridge, renderer }) {
    this.ws = wsServer;
    this.bridge = telemetryBridge;
    this.renderer = renderer;
  }

  start(contract) {
    setInterval(() => {
      const state = this._collectState();
      const view = this.renderer.render(state);

      this.ws?.clients?.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: "CONTROL_PLANE_UPDATE",
            timestamp: Date.now(),
            payload: view
          }));
        }
      });
    }, 1000); // 1s tick (safe default)
  }

  _collectState() {
    return {
      system: this.bridge.getSystemSnapshot(),
      events: this.bridge.getEventMetrics(),
      telemetry: this.bridge.getTelemetryFeed(),
      diagnostics: this.bridge.getDiagnostics()
    };
  }
}

module.exports = { DashboardWSFeed };
