const bus = require("../control/center/control.bus.v2");

class ExecutionBridge {

  constructor() {
    this.handlers = new Map();

    // register safe handlers
    this.register("PLUGIN_START", this.startPlugin.bind(this));
    this.register("PLUGIN_STOP", this.stopPlugin.bind(this));
    this.register("WS_CONNECT", this.wsConnect.bind(this));
    this.register("WS_MESSAGE", this.wsMessage.bind(this));
  }

  register(action, fn) {
    this.handlers.set(action, fn);
  }

  dispatch(event) {
    const { action, target, payload } = event;

    // 🔐 POLICY GATE
    if (action === "KERNEL_PATCH" || action === "SERVER_REWRITE") {
      return {
        ok: false,
        blocked: true,
        reason: "POLICY_BLOCKED_MUTATION"
      };
    }

    const handler = this.handlers.get(action);

    if (!handler) {
      return {
        ok: false,
        error: "NO_HANDLER"
      };
    }

    // log into control bus
    bus.emitEvent("EXECUTION", {
      action,
      target,
      payload
    });

    return handler({ target, payload });
  }

  // ================= SAFE EXECUTION HANDLERS =================

  startPlugin({ target }) {
    bus.emitEvent("PLUGIN", { id: target, state: "START" });
    return { ok: true, action: "PLUGIN_STARTED", target };
  }

  stopPlugin({ target }) {
    bus.emitEvent("PLUGIN", { id: target, state: "STOP" });
    return { ok: true, action: "PLUGIN_STOPPED", target };
  }

  wsConnect({ payload }) {
    bus.emitEvent("WS", { type: "CONNECT", payload });
    return { ok: true };
  }

  wsMessage({ payload }) {
    bus.emitEvent("WS", { type: "MESSAGE", payload });
    return { ok: true };
  }

  snapshot() {
    return bus.snapshot();
  }
}

module.exports = new ExecutionBridge();
