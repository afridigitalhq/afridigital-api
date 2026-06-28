// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class DAGScheduler {
  constructor() {
    this.nodes = new Map();   // eventId → event
    this.edges = new Map();   // eventId → dependencies[]
  }

  add(event) {
    const id = event.id || `${Date.now()}-${Math.random()}`;

    this.nodes.set(id, event);

    if (!this.edges.has(id)) {
      this.edges.set(id, event.dependsOn || []);
    }

    return id;
  }

  getReadyNodes() {
    const ready = [];

    for (const [id, deps] of this.edges.entries()) {
      const unresolved = deps.filter(d => !this.nodes.get(d)?.completed);

      if (unresolved.length === 0) {
        ready.push(this.nodes.get(id));
      }
    }

    return ready;
  }

  markDone(id) {
    const node = this.nodes.get(id);
    if (node) node.completed = true;
  }
}

module.exports = { DAGScheduler };
