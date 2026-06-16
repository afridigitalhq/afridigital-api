class DAG {
  constructor() {
    this.nodes = new Map();
  }

  add(name, { dependsOn = [], factory }) {
    this.nodes.set(name, {
      name,
      dependsOn,
      factory,
      status: "pending",
      instance: null,
      error: null
    });
  }

  run() {
    const executed = new Set();

    const execute = (node) => {
      if (executed.has(node.name)) return node.instance;

      // resolve dependencies first
      for (const dep of node.dependsOn) {
        const depNode = this.nodes.get(dep);
        if (!depNode) throw new Error(`Missing dependency: ${dep}`);
        execute(depNode);
      }

      try {
        node.instance = node.factory();
        node.status = "ok";
      } catch (e) {
        node.status = "failed";
        node.error = e.message;
      }

      executed.add(node.name);
      return node.instance;
    };

    for (const node of this.nodes.values()) {
      execute(node);
    }

    return this.snapshot();
  }

  snapshot() {
    const out = {};
    for (const [k, v] of this.nodes) {
      out[k] = {
        status: v.status,
        error: v.error
      };
    }
    return out;
  }
}

module.exports = { DAG };
