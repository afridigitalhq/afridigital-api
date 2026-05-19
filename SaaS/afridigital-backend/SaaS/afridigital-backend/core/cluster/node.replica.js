class NodeReplica {
  constructor(id) {
    this.id = id;
    this.peers = [];
  }

  connect(peer) {
    this.peers.push(peer);
  }

  broadcast(event) {
    for (const p of this.peers) {
      p.receive(event);
    }
  }

  receive(event) {
    // future: conflict resolution / vector clocks
    console.log(`[NODE ${this.id}] received`, event.type);
  }
}

module.exports = NodeReplica;
