class ReplicaSync {
  constructor(gossip) {
    this.gossip = gossip;
  }

  replicate(event) {
    if (!this.gossip) return;

    this.gossip.broadcast({
      type: "__replica_event",
      payload: event
    });
  }
}

module.exports = ReplicaSync;
