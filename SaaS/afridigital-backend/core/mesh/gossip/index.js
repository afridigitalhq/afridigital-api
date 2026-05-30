class GossipNode {
  constructor(bus) {
    this.bus = bus;
    this.peers = new Set();
    this.seen = new Set(); // dedup
  }

  registerPeer(url) {
    if (!url) return;
    this.peers.add(url);
  }

  digest(event) {
    const hash = `${event.type}:${event.__causal?.ts}:${JSON.stringify(event.payload)}`;
    return hash;
  }

  broadcast(event) {
    const id = this.digest(event);

    if (this.seen.has(id)) return;
    this.seen.add(id);

    for (const peer of this.peers) {
      // async fire-and-forget (offline safe)
      try {
        fetch(peer + "/mesh/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(event)
        }).catch(() => {});
      } catch (e) {}
    }
  }

  receive(event) {
    const id = this.digest(event);
    if (this.seen.has(id)) return false;

    this.seen.add(id);
    this.bus.publish(event.type, event);
    return true;
  }
}

module.exports = GossipNode;
