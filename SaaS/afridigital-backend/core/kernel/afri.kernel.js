/**
 * AfriOS Kernel Event Bus
 * Zero-global architecture core
 */

const EventEmitter = require("events");

class AfriKernel extends EventEmitter {
  constructor() {
    super();

    this.state = {
      status: "BOOTING",
      context: {},
      metrics: {},
    };
  }

  // 🔥 Emit with automatic state tracking
  dispatch(event, payload = {}) {
    this.emit(event, payload);

    // lightweight internal trace (no globals)
    this.emit("_trace", {
      event,
      payload,
      timestamp: Date.now(),
    });
  }

  // 🧠 Safe state updater (controlled mutation only)
  setState(key, value) {
    this.state[key] = value;

    this.dispatch("state:update", {
      key,
      value,
    });
  }

  getState() {
    return this.state;
  }

  // 🚀 Boot sequence hook
  boot() {
    this.state.status = "READY";
    this.dispatch("kernel:booted", this.state);
  }
}

// single kernel instance (NOT global variable pollution)
const kernel = new AfriKernel();

module.exports = kernel;

