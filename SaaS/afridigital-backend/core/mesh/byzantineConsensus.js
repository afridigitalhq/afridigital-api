const TrustEngine = require("./trustEngine");

class ByzantineConsensus {
  constructor() {
    this.trust = new TrustEngine();
    this.votes = new Map();
  }

  /**
   * Submit event vote from a node
   */
  vote(nodeId, eventHash, value = true) {
    this.trust.initNode(nodeId);

    if (!this.votes.has(eventHash)) {
      this.votes.set(eventHash, []);
    }

    this.votes.get(eventHash).push({
      nodeId,
      value,
      weight: this.trust.weight(nodeId)
    });
  }

  /**
   * Decide if event is accepted
   */
  decide(eventHash) {
    const votes = this.votes.get(eventHash) || [];

    let yes = 0;
    let no = 0;

    for (const v of votes) {
      if (v.value) yes += v.weight;
      else no += v.weight;
    }

    return {
      accepted: yes > no,
      confidence: yes / Math.max(yes + no, 1)
    };
  }

  /**
   * Detect malicious or unstable nodes
   */
  audit(nodeId, behaviorScore) {
    if (behaviorScore < 0.3) {
      this.trust.penalize(nodeId, 0.2);
    } else {
      this.trust.reward(nodeId, 0.05);
    }
  }

  snapshot() {
    return {
      trust: this.trust.snapshot(),
      votes: Object.fromEntries(this.votes)
    };
  }
}

module.exports = ByzantineConsensus;
