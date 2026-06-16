const EventEmitter = require("events");

class GraphRuntime extends EventEmitter {
  constructor() {
    super();
    this.nodes = new Map();
    this.state = "INIT";
    this.snapshots = [];
    this.quarantine = new Set();

    this.on("NODE_UPDATED", () => this.snapshot());
  }

  register(name, fn, deps = []) {
    this.nodes.set(name, { fn, deps, status: "PENDING" });
  }

  snapshot() {
    const snap = {
      time: Date.now(),
      state: this.state,
      nodes: this.nodes.size,
      ok: [...this.nodes.values()].filter(n => n.status === "OK").length,
      failed: [...this.nodes.values()].filter(n => n.status === "FAILED").length
    };

    this.snapshots.push(snap);
    if (this.snapshots.length > 10) this.snapshots.shift();
  }

  async runNode(name) {
    const node = this.nodes.get(name);
    if (!node || this.quarantine.has(name)) return;

    try {
      node.status = "RUNNING";
      await node.fn();
      node.status = "OK";
    } catch (e) {
      node.status = "FAILED";
      this.quarantine.add(name);
      this.state = "DEGRADED";
    }

    this.emit("NODE_UPDATED", name);
  }

  async run() {
    this.state = "RUNNING";

    for (const name of this.nodes.keys()) {
      await this.runNode(name);
    }

    this.state = "READY";
    this.emit("NODE_UPDATED", "FINAL");
  }

  getState() {
    return {
      state: this.state,
      nodes: this.nodes.size,
      ok: [...this.nodes.values()].filter(n => n.status === "OK").length,
      failed: [...this.nodes.values()].filter(n => n.status === "FAILED").length
    };
  }
}

module.exports = new GraphRuntime();
