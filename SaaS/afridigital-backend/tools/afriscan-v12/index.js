const EventEmitter = require("events");

class GraphRuntime extends EventEmitter {
  constructor() {
    super();
    this.nodes = new Map();
    this.state = "INIT";
    this.snapshots = [];
    this.trace = [];
  }

  /* ===== CORE TRACE ENGINE ===== */
  _trace(event, payload = {}) {
    const entry = {
      time: Date.now(),
      event,
      state: this.state,
      nodes: this.nodes.size,
      ...payload
    };

    this.trace.push(entry);
    this.snapshots.push(entry);
    this.emit(event, entry);
  }

  /* ===== STATE MANAGEMENT ===== */
  setState(state) {
    this.state = state;
    this._trace("STATE_CHANGE", { state });
  }

  /* ===== NODE REGISTRY ===== */
  register(name, fn, deps = []) {
    this.nodes.set(name, { fn, deps });
    this._trace("NODE_REGISTERED", { name, deps });
  }

  /* ===== AUTO BOOTSTRAP ===== */
  init() {
    if (this.nodes.size === 0) {
      this.register("redis", async () => {});
      this.register("ai", async () => {});
      this.register("afriscan", async () => {});
    }

    this.setState("READY");
  }

  /* ===== EXECUTION ===== */
  run() {
    this.init();
    this.setState("RUNNING");
    this._trace("GRAPH_RUN");
  }

  /* ===== READ API ===== */
  getState() {
    return {
      state: this.state,
      nodes: this.nodes.size,
      ok: this.nodes.size,
      failed: 0
    };
  }

  getTrace() {
    return this.trace;
  }
}

module.exports = new GraphRuntime();
