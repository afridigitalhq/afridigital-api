const { getControlFeed } = require("../ws.control.feed");
const EventEmitter = require("events");

class DashboardStream extends EventEmitter {
  constructor() {
    super();
    this.interval = null;
  }

  start() {
    if (this.interval) return;

    this.interval = setInterval(() => {
      const snapshot = getControlFeed();

      this.emit("frame", {
        type: "DASHBOARD_FRAME",
        payload: snapshot,
        ts: Date.now()
      });

    }, 1000);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }
}

module.exports = new DashboardStream();
