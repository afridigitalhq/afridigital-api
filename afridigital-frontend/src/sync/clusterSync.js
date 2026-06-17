export class ClusterSync {
  constructor() {
    this.nodes = new Map();
  }

  registerNode(id, state) {
    this.nodes.set(id, {
      state,
      lastSync: Date.now()
    });
  }

  updateNode(id, patch) {
    const node = this.nodes.get(id);
    if (!node) return;

    node.state = {
      ...node.state,
      ...patch
    };

    node.lastSync = Date.now();
  }

  getSnapshot() {
    return Array.from(this.nodes.entries()).map(([id, v]) => ({
      id,
      ...v.state
    }));
  }
}
