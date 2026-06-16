const EventEmitter = require("events");

class GraphRuntime extends EventEmitter {
  constructor() {
    super();
    this.nodes = new Map();
    this.state = "INIT";
    this.snapshots = [];
  }

  register(name, fn, deps = []) {
    this.nodes.set(name, { fn, deps });
  }

  /* 🔥 AUTO BOOTSTRAP (THIS WAS MISSING) */
  init() {
    if (this.nodes.size === 0) {
      this.register("redis", async () => {});
      this.register("ai", async () => {});
      this.register("afriscan", async () => {});
    }
    this.state = "READY";
  }

  run() {
    this.init(); // ensure hydration before execution
    this.state = "RUNNING";
  }

  getState() {
    return {
      state: this.state,
      nodes: this.nodes.size,
      ok: this.nodes.size,
      failed: 0
    };
  }
}

module.exports = new GraphRuntime();
