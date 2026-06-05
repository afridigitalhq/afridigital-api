class ConsensusLayer {
  constructor() {
    this.votes = new Map();
  }

  vote(eventId, nodeId, weight = 1) {
    if (!this.votes.has(eventId)) {
      this.votes.set(eventId, { total: 0, nodes: new Set() });
    }

    const entry = this.votes.get(eventId);

    if (!entry.nodes.has(nodeId)) {
      entry.nodes.add(nodeId);
      entry.total += weight;
    }

    return entry.total;
  }

  decide(eventId, threshold = 2) {
    const v = this.votes.get(eventId);
    if (!v) return false;

    return v.total >= threshold;
  }
}

module.exports = ConsensusLayer;
