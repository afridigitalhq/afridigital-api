class ClusterManager {
  constructor(nodes, router) {
    this.nodes = nodes;
    this.router = router;
  }

  dispatch(event) {
    const index = this.router.route(event);
    const node = this.nodes[index];
    node.handle(event);
  }
}

module.exports = ClusterManager;
