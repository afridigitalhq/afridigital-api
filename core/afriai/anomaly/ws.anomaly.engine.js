const EventEmitter = require("events");

class WSAnomalyEngine extends EventEmitter {
  constructor() {
    super();

    this.window = [];

    this.lastAlert = 0;
    this.cooldownMs = 2000;

    this.thresholds = {
      msgPerSec: 50,
      connSpike: 20
    };
  }

  ingest(event) {
    const now = Date.now();

    this.window.push({ ...event, ts: now });

    // keep last 10 seconds only
    this.window = this.window.filter(e => now - e.ts < 10000);

    this.evaluate();
  }

  evaluate() {
    const msgCount = this.window.filter(e => e.type).length;
    const connEvents = this.window.filter(e => e.type === "CONNECT").length;

    const alerts = [];

    if (msgCount > this.thresholds.msgPerSec) {
      alerts.push({
        type: "MESSAGE_SPIKE",
        value: msgCount
      });
    }

    if (connEvents > this.thresholds.connSpike) {
      alerts.push({
        type: "CONNECTION_SPIKE",
        value: connEvents
      });
    }

    if (alerts.length) {
      this.emit("anomaly", {
        alerts,
        windowSize: this.window.length,
        ts: Date.now()
      });
    }
  }
}

module.exports = new WSAnomalyEngine();
