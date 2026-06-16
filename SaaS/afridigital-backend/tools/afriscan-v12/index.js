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

    this.snapshots.push({
      time: Date.now(),
      event: "NODE_REGISTERED",
      state: this.state,
      nodes: this.nodes.size,
      name,
      deps
    });

    this.emit("NODE_REGISTERED", { name, deps });
  }

  init() {
    if (this.nodes.size === 0) {
      this.register("redis", async () => {});
      this.register("ai", async () => {});
      this.register("afriscan", async () => {});
    }

    this.state = "READY";
    this.emit("STATE_CHANGE", { state: this.state });

    this.snapshots.push({
      time: Date.now(),
      event: "STATE_CHANGE",
      state: this.state,
      nodes: this.nodes.size
    });
  }

  run() {
    this.init();

    this.state = "RUNNING";
    this.emit("STATE_CHANGE", { state: this.state });

    this.snapshots.push({
      time: Date.now(),
      event: "GRAPH_RUN",
      state: this.state,
      nodes: this.nodes.size
    });

    this.emit("GRAPH_RUN", {
      state: this.state,
      nodes: this.nodes.size
    });
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
