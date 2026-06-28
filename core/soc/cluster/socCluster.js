export class SOCCluster {
  constructor() {
    this.nodes = ["node-a", "node-b", "node-c"];
  }

  broadcast(event) {
    return this.nodes.map(n => ({
      node: n,
      status: "replicated",
      event
    }));
  }
}
