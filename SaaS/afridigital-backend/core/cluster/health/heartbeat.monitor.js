class HeartbeatMonitor {
  constructor(timeout = 15000) {
    this.timeout = timeout;
    this.nodes = new Map();
  }

  beat(nodeId, meta = {}) {
    this.nodes.set(nodeId, {
      ...meta,
      lastSeen: Date.now(),
      status: "ONLINE"
    });
  }

  check() {
    const now = Date.now();

    for (const [id, node] of this.nodes.entries()) {
      if (now - node.lastSeen > this.timeout) {
        node.status = "OFFLINE";
        console.log("[FAILOVER] Node offline:", id);
      }
    }
  }

  getNodes() {
    return [...this.nodes.entries()];
  }
}

module.exports = new HeartbeatMonitor();
